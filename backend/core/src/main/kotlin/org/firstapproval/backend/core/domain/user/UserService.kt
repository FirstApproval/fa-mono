package org.firstapproval.backend.core.domain.user

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.OauthType.*
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.exception.MissingEmailException
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.nio.charset.StandardCharsets
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.*
import java.util.function.*
import javax.naming.LimitExceededException

const val EMAIL_CONFIRMATION_CODE_LENGTH = 6

const val SEND_EMAIL_LIMIT = 1

const val AUTHORIZATION_RATE_LIMIT = 4

@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailRegistrationConfirmationRepository: EmailRegistrationConfirmationRepository,
    private val passwordResetConfirmationRepository: PasswordResetConfirmationRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authorizationLimitRepository: AuthorizationLimitRepository,
    private val emailSender: JavaMailSender,
    private val templateEngine: SpringTemplateEngine,
    private val emailProperties: EmailProperties,
    private val frontendProperties: FrontendProperties
) {

    val log = logger {}

    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        val userSupplier = when (oauthUser.type) {
            GOOGLE -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByEmail(oauthUser.email)
                } else {
                    throw MissingEmailException("Missing email from google")
                }
            }

            FACEBOOK -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByEmail(oauthUser.email)
                } else {
                    throw MissingEmailException("Missing email from facebook")
                }
            }

            LINKEDIN -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByEmail(oauthUser.email)
                } else {
                    throw MissingEmailException("Missing email from linkedin")
                }
            }
        }

        return saveOrUpdateUser(userSupplier, oauthUser)
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
                sendYouAlreadyHaveAccount(user)
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
        val link = "${frontendProperties.url}/${code}"
        sendRegistrationMessageEmail(code, link, prevTry.email)
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
        val link = "${frontendProperties.url}/${code}"
        sendRegistrationMessageEmail(code, link, email)
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
        return userRepository.save(
            User(
                id = userId,
                email = emailRegistrationConfirmation.email,
                password = emailRegistrationConfirmation.password,
                firstName = emailRegistrationConfirmation.firstName,
                lastName = emailRegistrationConfirmation.lastName,
                username = if (userByUsername != null) userId.toString() else username
            )
        )
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
            sendEmailForPasswordReset(email, previousTry.id.toString())
        } else {
            val passwordResetRequestId = randomUUID()
            passwordResetConfirmationRepository.save(PasswordResetConfirmation(id = passwordResetRequestId, user = user))
            sendEmailForPasswordReset(email, passwordResetRequestId.toString())
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

    private fun saveOrUpdateUser(findUserFunc: Supplier<User?>, oauthUser: OauthUser): User {
        val user = findUserFunc.get()
        if (user != null) {
            user.email = oauthUser.email
            user.firstName = oauthUser.firstName
            user.lastName = oauthUser.lastName
            user.middleName = oauthUser.middleName
            user.fullName = oauthUser.fullName

            when (oauthUser.type) {
                GOOGLE -> user.googleId = oauthUser.externalId
                FACEBOOK -> user.facebookId = oauthUser.externalId
                LINKEDIN -> user.linkedinId = oauthUser.externalId
            }

            return user
        }

        val userByUsername = userRepository.findByUsername(oauthUser.username)
        val id = randomUUID()
        return userRepository.save(
            User(
                id = id,
                username = if (userByUsername != null) id.toString() else oauthUser.username,
                googleId = if (oauthUser.type == GOOGLE) oauthUser.externalId else null,
                facebookId = if (oauthUser.type == FACEBOOK) oauthUser.externalId else null,
                linkedinId = if (oauthUser.type == LINKEDIN) oauthUser.externalId else null,
                email = oauthUser.email,
                firstName = oauthUser.firstName,
                lastName = oauthUser.lastName,
                middleName = oauthUser.middleName,
                fullName = oauthUser.fullName
            )
        )
    }

    private fun sendRegistrationMessageEmail(code: String, link: String, email: String) {
        if (emailProperties.noopMode) {
            log.info { code }
            return
        }
        val message = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, StandardCharsets.UTF_8.name())
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["code"] = code
        model["link"] = link
        model["email"] = email
        context.setVariables(model)
        val html = templateEngine.process("email-template", context)
        helper.setFrom(emailProperties.from)
        helper.setTo(email)
        helper.setText(html, true)
        helper.setSubject("[FirstApproval] Confirming an email address")
        emailSender.send(message)
    }

    private fun sendYouAlreadyHaveAccount(user: User) {
        if (emailProperties.noopMode) {
            log.info { "You already registered via oauth" }
            return
        }
        val providers = mutableListOf<String>()
        if (user.googleId != null) {
            providers.add("Google")
        }
        if (user.facebookId != null) {
            providers.add("Facebook")
        }
        if (user.linkedinId != null) {
            providers.add("Linked in")
        }
        val message = SimpleMailMessage()
        message.from = emailProperties.from
        message.setTo(user.email)
        message.subject = "[FirstApproval] You already have account"
        message.text = "You already signed up via ${providers.joinToString()}"
        emailSender.send(message)
    }


    private fun sendEmailForPasswordReset(email: String, resetId: String) {
        // TODO SEND EMAIL TO USER WITH RESET LINK
        val link = "${frontendProperties.url}/$resetId"
        if (emailProperties.noopMode) {
            log.info { link }
            return
        }
        val message = SimpleMailMessage()
        message.from = emailProperties.from
        message.setTo(email)
        message.subject = "[FirstApproval] Password recovery link"
        message.text = link
        emailSender.send(message)
    }
}

enum class OauthType {
    GOOGLE,
    FACEBOOK,
    LINKEDIN
}

