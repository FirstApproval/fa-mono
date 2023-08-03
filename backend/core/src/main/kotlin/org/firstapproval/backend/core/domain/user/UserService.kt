package org.firstapproval.backend.core.domain.user

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthor
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthorRepository
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthorRepository
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.email.EmailChangeConfirmationRepository
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.EMAIL_CONFIRMATION_CODE_LENGTH
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.*
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
    private val emailSender: JavaMailSender,
    private val unconfirmedUserRepository: UnconfirmedUserRepository,
    private val unconfirmedAuthorRepository: UnconfirmedAuthorRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository
) {

    val log = logger {}

    @Transactional(readOnly = true)
    fun getPublicUserProfile(id: UUID): User = userRepository.getReferenceById(id)


    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        val user = userRepository.findByEmailOrExternalIdAndType(
            email = oauthUser.email,
            externalId = oauthUser.externalId,
            type = oauthUser.type
        )

        if (user != null) {
            user.externalIds[oauthUser.type] = oauthUser.externalId
            return user
        }

        val userByUsername = userRepository.findByUsername(oauthUser.username)
        val id = randomUUID()
        val savedUser = userRepository.save(
            User(
                id = id,
                username = if (userByUsername != null) id.toString() else oauthUser.username,
                externalIds = mutableMapOf(oauthUser.type to oauthUser.externalId),
                email = oauthUser.email,
                firstName = oauthUser.firstName,
                lastName = oauthUser.lastName,
                middleName = oauthUser.middleName,
                fullName = oauthUser.fullName
            )
        )
        migratePublicationOfUnconfirmedUser(savedUser)
        return savedUser
    }

    @Transactional
    fun get(id: UUID): User {
        return userRepository.findById(id).orElseThrow()
    }

    @Transactional
    fun startUserRegistration(email: String, password: String, firstName: String?, lastName: String?): UUID? {
        val prevTry = emailRegistrationConfirmationRepository.findByEmail(email)
        return if (prevTry != null) {
            alreadyStartedRegistration(prevTry, password, firstName, lastName)
        } else {
            val user = userRepository.findByEmailAndPasswordIsNull(email)
            if (user != null) {
                notificationService.sendYouAlreadyHaveAccount(user)
                null
            } else {
                newAttemptForRegistration(email, password, firstName, lastName)
            }
        }
    }

    private fun alreadyStartedRegistration(
        prevTry: EmailRegistrationConfirmation,
        password: String,
        firstName: String?,
        lastName: String?
    ): UUID {
        if (prevTry.attemptCount >= SEND_EMAIL_LIMIT) {
            throw LimitExceededException("limit exceeded")
        }
        if (userRepository.existsByEmail(prevTry.email)) {
            throw RecordConflictException("user already exists")
        }
        prevTry.lastTryTime = now()
        prevTry.attemptCount += 1
        prevTry.firstName = firstName
        prevTry.lastName = lastName
        prevTry.password = passwordEncoder.encode(password)
        // TODO CREATE LINK
        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        val link = "${frontendProperties.registrationConfirmationUrl}/${code}"
        notificationService.sendConfirmationEmail(code, link, prevTry.email, "email-template")
        return prevTry.id
    }

    private fun newAttemptForRegistration(email: String, password: String, firstName: String?, lastName: String?): UUID {
        if (userRepository.existsByEmail(email)) {
            throw RecordConflictException("user already exists")
        }
        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        val registrationToken = randomUUID()
        emailRegistrationConfirmationRepository.save(
            EmailRegistrationConfirmation(
                id = registrationToken,
                email = email,
                password = passwordEncoder.encode(password),
                code = code,
                firstName = firstName,
                lastName = lastName
            )
        )
        // TODO CREATE LINK
        val link = "${frontendProperties.registrationConfirmationUrl}/${code}"
        notificationService.sendConfirmationEmail(code, link, email, "email-template")
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
                username = if (userByUsername != null) userId.toString() else username
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

    @Transactional
    fun update(id: UUID, firstName: String, middleName: String?, lastName: String, username: String, selfInfo: String?) {
        val userFromDb = userRepository.findByUsername(username)
        if (userFromDb != null && userFromDb.id != id) throw RecordConflictException("username already taken")
        val user = userRepository.findById(id).orElseThrow()
        user.firstName = firstName
        user.middleName = middleName
        user.lastName = lastName
        user.username = username
        user.selfInfo = selfInfo
        userRepository.save(user)
    }

    @Transactional
    fun delete(id: UUID) {
        userRepository.deleteById(id)
    }

    @Transactional
    fun migratePublicationOfUnconfirmedUser(user: User) {
        val unconfirmedUser = unconfirmedUserRepository.findByEmail(user.email)
        if (unconfirmedUser != null) {
            val unconfirmedAuthorAndPublications = unconfirmedAuthorRepository.findByUserId(unconfirmedUser.id)
            unconfirmedAuthorAndPublications.forEach {
                confirmedAuthorRepository.save(ConfirmedAuthor(it.publicationId, user.id))
            }
            unconfirmedUserRepository.delete(unconfirmedUser)
        }
    }
}

enum class OauthType {
    GOOGLE,
    FACEBOOK,
    LINKEDIN,
    ORCID
}

