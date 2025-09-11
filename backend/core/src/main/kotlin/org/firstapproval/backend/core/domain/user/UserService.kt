package org.firstapproval.backend.core.domain.user

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.api.server.model.RegistrationRequest
import org.firstapproval.api.server.model.UserUpdateRequest
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.organizations.OrganizationService
import org.firstapproval.backend.core.domain.organizations.Workplace
import org.firstapproval.backend.core.domain.publication.authors.AuthorRepository
import org.firstapproval.backend.core.domain.user.email.EmailChangeConfirmationRepository
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.domain.user.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.user.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.PROFILE_IMAGES
import org.firstapproval.backend.core.utils.EMAIL_CONFIRMATION_CODE_LENGTH
import org.firstapproval.backend.core.utils.generateCode
import org.firstapproval.backend.core.utils.require
import org.firstapproval.backend.core.web.errors.RecordConflictException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionTemplate
import java.io.ByteArrayInputStream
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.fromString
import java.util.UUID.randomUUID
import javax.naming.LimitExceededException

const val SEND_EMAIL_LIMIT = 2

const val AUTHORIZATION_RATE_LIMIT = 4

@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailRegistrationConfirmationRepository: EmailRegistrationConfirmationRepository,
    private val passwordResetConfirmationRepository: PasswordResetConfirmationRepository,
    private val emailChangeConfirmationRepository: EmailChangeConfirmationRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authorizationLimitRepository: AuthorizationLimitRepository,
    private val frontendProperties: FrontendProperties,
    private val notificationService: NotificationService,
    private val authorRepository: AuthorRepository,
    private val fileStorageService: FileStorageService,
    private val transactionTemplate: TransactionTemplate,
    private val organizationService: OrganizationService,
) {

    val log = logger {}

    @Transactional(readOnly = true)
    fun getPublicUserProfile(id: UUID): User = userRepository.getReferenceById(id)

    @Transactional(readOnly = true)
    fun getPublicUserProfile(username: String): User = userRepository.findByUsername(username).require()

    @Transactional(isolation = REPEATABLE_READ)
    fun oauthSaveOrUpdate(oauthUser: OauthUser, utmSource: String?, initialReferrer: String?): User {
        val user = userRepository.findByExternalIdAndType(
            externalId = oauthUser.externalId,
            type = oauthUser.type
        ) ?: userRepository.findByEmail(email = oauthUser.email)

        if (user != null) {
            user.externalIds[oauthUser.type] = oauthUser.externalId
            return user
        }

        val userByUsername = userRepository.findByUsername(oauthUser.username)
        val id = randomUUID()
        val savedUser = userRepository.save(
            User(
                id = id,
                // if userByUsername exists need to use id as username to avoid collisions
                username = if (userByUsername != null) id.toString() else oauthUser.username,
                externalIds = mutableMapOf(oauthUser.type to oauthUser.externalId),
                email = oauthUser.email,
                firstName = oauthUser.firstName ?: "",
                lastName = oauthUser.lastName ?: "",
                middleName = oauthUser.middleName,
                fullName = oauthUser.fullName,
                utmSource = utmSource,
                initialReferrer = initialReferrer
            )
        )
        migratePublicationOfUnconfirmedUser(savedUser)
        return savedUser
    }

    @Transactional
    fun get(id: UUID) = userRepository.getReferenceById(id)

    fun getProfileImage(id: String?) = if (id != null) fileStorageService.get(PROFILE_IMAGES, id).readAllBytes() else null

    @Transactional
    fun startUserRegistration(registrationRequest: RegistrationRequest): UUID? {
        val prevTry = emailRegistrationConfirmationRepository.findByEmail(registrationRequest.email)
        return if (prevTry != null) {
            alreadyStartedRegistration(prevTry, registrationRequest.password, registrationRequest.firstName, registrationRequest.lastName)
        } else {
            val user = userRepository.findByEmailAndPasswordIsNull(registrationRequest.email)
            if (user != null) {
                notificationService.sendYouAlreadyHaveAccount(user)
                null
            } else {
                newAttemptForRegistration(
                    AttemptRegistration(
                        email = registrationRequest.email,
                        password = registrationRequest.password,
                        firstName = registrationRequest.firstName,
                        lastName = registrationRequest.lastName,
                        utmSource = registrationRequest.utmSource,
                        utmMedium = registrationRequest.utmMedium,
                        utmCampaign = registrationRequest.utmCampaign,
                        initialReferrer = registrationRequest.initialReferrer
                    )
                )
            }
        }
    }

    private fun alreadyStartedRegistration(
        prevTry: EmailRegistrationConfirmation,
        password: String,
        firstName: String,
        lastName: String
    ): UUID {
        if (prevTry.attemptCount >= SEND_EMAIL_LIMIT) {
            throw LimitExceededException("limit exceeded")
        }
        if (userRepository.existsByEmail(prevTry.email)) {
            throw RecordConflictException("user already exists")
        }

        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        prevTry.code = code
        prevTry.lastTryTime = now()
        prevTry.attemptCount += 1
        prevTry.firstName = firstName
        prevTry.lastName = lastName
        prevTry.password = passwordEncoder.encode(password)
        // TODO CREATE LINK
        val link = "${frontendProperties.registrationConfirmationUrl}/${prevTry.id}/${code}"
        notificationService.sendConfirmationEmail(code, link, prevTry.email, "email-template")
        return prevTry.id
    }

    private fun newAttemptForRegistration(attemptRegistration: AttemptRegistration): UUID {
        if (userRepository.existsByEmail(attemptRegistration.email)) {
            throw RecordConflictException("user already exists")
        }
        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        val registrationToken = randomUUID()
        emailRegistrationConfirmationRepository.save(
            EmailRegistrationConfirmation(
                id = registrationToken,
                email = attemptRegistration.email,
                password = passwordEncoder.encode(attemptRegistration.password),
                code = code,
                firstName = attemptRegistration.firstName,
                lastName = attemptRegistration.lastName,
                utmSource = attemptRegistration.utmSource,
                utmMedium = attemptRegistration.utmMedium,
                utmCampaign = attemptRegistration.utmCampaign,
                initialReferrer = attemptRegistration.initialReferrer
            )
        )
        // TODO CREATE LINK
        val link = "${frontendProperties.registrationConfirmationUrl}/${registrationToken}/${code}"
        notificationService.sendConfirmationEmail(code, link, attemptRegistration.email, "email-template")
        return registrationToken
    }

    @Transactional
    fun finishRegistration(registrationToken: UUID, code: String): User {
        val emailRegistrationConfirmation = emailRegistrationConfirmationRepository.getReferenceById(registrationToken)
        if (emailRegistrationConfirmation.code != code) {
            throw AccessDeniedException("access denied")
        }
        emailRegistrationConfirmationRepository.delete(emailRegistrationConfirmation)
        val username = emailRegistrationConfirmation.email.split("@").first()
        val userByUsername = userRepository.findByUsername(username)
        val userId = randomUUID()
        val user = userRepository.save(
            User(
                id = userId,
                email = emailRegistrationConfirmation.email,
                password = emailRegistrationConfirmation.password,
                firstName = emailRegistrationConfirmation.firstName,
                lastName = emailRegistrationConfirmation.lastName,
                utmSource = emailRegistrationConfirmation.utmSource,
//                utmMedium = emailRegistrationConfirmation.utmMedium,
//                utmCampaign = emailRegistrationConfirmation.utmCampaign,
                initialReferrer = emailRegistrationConfirmation.initialReferrer,
                username = if (userByUsername != null) userId.toString() else username,
                isNameConfirmed = true
            )
        )
        migratePublicationOfUnconfirmedUser(user)
        return user
    }

    @Transactional
    fun requestPasswordReset(email: String) {
        val user = userRepository.findByEmail(email) ?: return
        val previousTry = passwordResetConfirmationRepository.findByUserId(user.id)
        if (previousTry != null) {
            if (previousTry.attemptCount >= SEND_EMAIL_LIMIT) {
                throw LimitExceededException("resend email limit exceeded")
            }
            previousTry.attemptCount += 1
            previousTry.lastTryTime = now()
            notificationService.sendEmailForPasswordReset(email, previousTry.id.toString())
        } else {
            val passwordResetRequestId = randomUUID()
            passwordResetConfirmationRepository.save(PasswordResetConfirmation(id = passwordResetRequestId, user = user))
            notificationService.sendEmailForPasswordReset(email, passwordResetRequestId.toString())
        }
    }

    @Transactional
    fun resetPassword(passwordResetRequestId: UUID, password: String): User {
        val passwordResetRequest = passwordResetConfirmationRepository.getReferenceById(passwordResetRequestId)
        passwordResetRequest.user.password = passwordEncoder.encode(password)
        passwordResetConfirmationRepository.delete(passwordResetRequest)
        if (passwordResetRequest.user.email != null) {
            notificationService.sendEmailPasswordChanged(passwordResetRequest.user.email!!, passwordResetRequest.user.firstName)
        }
        return passwordResetRequest.user
    }

    @Transactional
    fun checkUserEmailPassword(email: String, password: String): User? {
        val rateLimit = authorizationLimitRepository.findByEmail(email)
        if (rateLimit != null) {
            if (rateLimit.count >= AUTHORIZATION_RATE_LIMIT) {
                throw LimitExceededException()
            } else {
                rateLimit.count += 1
            }
        } else {
            authorizationLimitRepository.save(AuthorizationLimit(id = randomUUID(), email = email))
        }
        val user = userRepository.findByEmail(email) ?: return null
        return if (!passwordEncoder.matches(password, user.password)) {
            null
        } else {
            user
        }
    }

    @Transactional
    fun setPassword(user: User, password: String) {
        if (user.password != null) {
            throw AccessDeniedException("Password already set")
        } else {
            user.password = passwordEncoder.encode(password)
        }
        userRepository.save(user)
    }

    @Transactional
    fun changePassword(user: User, newPassword: String, previousPassword: String) {
        if (!passwordEncoder.matches(previousPassword, user.password!!)) {
            throw IllegalArgumentException("wrong password")
        } else {
            user.password = passwordEncoder.encode(newPassword)
        }
        if (user.email != null) {
            notificationService.sendEmailPasswordChanged(user.email!!, user.firstName)
        }
        userRepository.save(user)
    }

    @Scheduled(cron = "\${clear-uncompleted.cron}")
    @SchedulerLock(name = "UserService.clearUncompleted")
    @Transactional
    fun clearUncompleted() {
        emailRegistrationConfirmationRepository.deleteByCreationTimeBefore(now().minusDays(7))
        passwordResetConfirmationRepository.deleteByCreationTimeBefore(now().minusHours(2))
        emailChangeConfirmationRepository.deleteByCreationTimeBefore(now().minusHours(2))
    }

    @Scheduled(cron = "\${clear-rate-limits.cron}")
    @SchedulerLock(name = "UserService.clearRateLimits")
    @Transactional
    fun clearRateLimits() {
        authorizationLimitRepository.deleteByCreationTimeBefore(now().minusMinutes(30))
        emailRegistrationConfirmationRepository.findByLastTryTimeNotNullAndLastTryTimeBefore(now().minusMinutes(30)).forEach {
            it.attemptCount = 0
            it.lastTryTime = null
        }
        passwordResetConfirmationRepository.findByLastTryTimeNotNullAndLastTryTimeBefore(now().minusMinutes(30)).forEach {
            it.attemptCount = 0
            it.lastTryTime = null
        }
    }

    fun update(id: UUID, request: UserUpdateRequest) {
        var profileImageIdToDelete: UUID? = null
        with(request) {
            transactionTemplate.execute { _ ->
                val userFromDb = userRepository.findByUsername(username)
                if (userFromDb != null && userFromDb.id != id) throw RecordConflictException("username already taken")
                val user = userRepository.findById(id).orElseThrow()
                user.firstName = firstName
                user.middleName = middleName
                user.lastName = lastName
                user.username = username
                if (confirmName == true) {
                    user.isNameConfirmed = true
                }
                if (confirmWorkplaces == true) {
                    user.isWorkplacesConfirmed = true
                }

                if (workplaces != null && workplaces.size > 0) {
                    val userWorkplaces = workplaces.map { workplace ->
                        val organization = organizationService.getOrSave(workplace.organization)
                        Workplace(
                            id = workplace.id ?: randomUUID(),
                            organization = organization,
                            organizationDepartment = workplace.department,
                            address = workplace.address,
                            postalCode = workplace.postalCode,
                            creationTime = workplace.creationTime?.toZonedDateTime() ?: now(),
                            editingTime = now(),
                            user = user
                        )
                    }
                    user.workplaces.clear()
                    userRepository.saveAndFlush(user)
                    user.workplaces.addAll(userWorkplaces)
                }

                if (deleteProfileImage == true && user.profileImage != null) {
                    profileImageIdToDelete = fromString(user.profileImage)
                    user.profileImage = null
                } else if (profileImage != null) {
                    if (user.profileImage != null) {
                        profileImageIdToDelete = fromString(user.profileImage)
                    }
                    user.profileImage = randomUUID().toString().also {
                        fileStorageService.save(
                            PROFILE_IMAGES,
                            it,
                            ByteArrayInputStream(profileImage),
                            profileImage.size.toLong()
                        )
                    }
                }
            }
        }
        profileImageIdToDelete?.let { fileStorageService.delete(PROFILE_IMAGES, it) }
    }

    @Transactional
    fun delete(id: UUID) {
        userRepository.deleteById(id)
    }

    @Transactional
    fun migratePublicationOfUnconfirmedUser(user: User) {
        val email = user.email
        if (email != null) {
            val unconfirmedUsers = authorRepository.findByEmailAndIsConfirmedFalse(email)
            unconfirmedUsers.forEach {
                it.isConfirmed = true
                it.user = user
            }
            unconfirmedUsers.flatMap { it.workplaces }
                .distinctBy { it.organization.id }
                .map {
                    Workplace(
                        organization = it.organization,
                        organizationDepartment = it.organizationDepartment,
                        address = it.address,
                        postalCode = it.postalCode,
                        user = user
                    )
                }.let { user.workplaces.addAll(it) }
        }
    }
}

class AttemptRegistration(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val utmSource: String?,
    val utmMedium: String?,
    val utmCampaign: String?,
    val initialReferrer: String?
)

enum class OauthType {
    GOOGLE,
    FACEBOOK,
    LINKEDIN,
    ORCID
}
