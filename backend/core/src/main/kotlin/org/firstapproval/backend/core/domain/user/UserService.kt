package org.firstapproval.backend.core.domain.user

import jakarta.mail.internet.MimeMessage
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthType.ORCID
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
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
import java.util.UUID
import java.util.UUID.randomUUID
import javax.naming.LimitExceededException

const val EMAIL_CONFIRMATION_CODE_LENGTH = 6

const val SEND_EMAIL_LIMIT = 3

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

    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        return when (oauthUser.type) {
            GOOGLE -> saveOrUpdateGoogleUser(oauthUser)
            ORCID -> saveOrUpdateOrcidUser(oauthUser)
        }
    }

    @Transactional
    fun get(id: UUID): User {
        return userRepository.findById(id).orElseThrow()
    }

    @Transactional
    fun startUserRegistration(email: String, password: String): UUID {
        val prevTry = emailRegistrationConfirmationRepository.findByEmail(email)
        if (prevTry != null) {
            if (prevTry.attemptCount >= SEND_EMAIL_LIMIT) {
                throw LimitExceededException("limit exceeded")
            }
            prevTry.lastTryTime = now()
            prevTry.attemptCount += 1
            prevTry.password = passwordEncoder.encode(password)
            // TODO CREATE LINK
            val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
            val link = "${frontendProperties.url}/${code}"
            val message = createMessage(code, link, email)
            emailSender.send(message)
            return prevTry.id
        } else {
            val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
            val registrationToken = randomUUID()
            // TODO CREATE LINK
            val link = "${frontendProperties.url}/${code}"
            val message = createMessage(code, link, email)
            emailSender.send(message)
            return emailRegistrationConfirmationRepository.save(
                EmailRegistrationConfirmation(
                    id = registrationToken,
                    email = email,
                    password = passwordEncoder.encode(password),
                    code = code
                )
            ).id
        }
    }

    @Transactional
    fun requestPasswordReset(email: String) {
        val user = userRepository.findByEmail(email) ?: return
        val passwordResetRequestId = randomUUID()
        val previousTry = passwordResetConfirmationRepository.findByUserId(user.id)
        if (previousTry != null) {
            if (previousTry.attemptCount >= SEND_EMAIL_LIMIT) {
                throw LimitExceededException("resend email limit exceeded")
            }
            previousTry.attemptCount += 1
            previousTry.lastTryTime = now()
        } else {
            passwordResetConfirmationRepository.save(PasswordResetConfirmation(id = passwordResetRequestId, user = user))
        }
        // TODO SEND EMAIL TO USER WITH RESET LINK
        val link = "${frontendProperties.url}/id"
        val message = SimpleMailMessage()
        message.setFrom(emailProperties.from)
        message.setTo(email)
        message.setSubject(createSubject())
        message.setText(link)
        emailSender.send(message)
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
        authorizationLimitRepository.flush()
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

    @Transactional
    fun finishRegistration(registrationToken: UUID, code: String): User {
        val emailRegistrationConfirmation = emailRegistrationConfirmationRepository.getReferenceById(registrationToken)
        if (emailRegistrationConfirmation.code != code) {
            throw AccessDeniedException("ACCESS DENIED")
        }
        emailRegistrationConfirmationRepository.delete(emailRegistrationConfirmation)
        return userRepository.save(
            User(
                id = randomUUID(),
                email = emailRegistrationConfirmation.email,
                password = emailRegistrationConfirmation.password
            )
        )
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
            it.attemptCount = 1
            it.lastTryTime = null
        }
        passwordResetConfirmationRepository.findByLastTryTimeNotNullAndLastTryTimeBefore(now().minusMinutes(30)).forEach {
            it.attemptCount = 1
            it.lastTryTime = null
        }
    }

    private fun saveOrUpdateGoogleUser(oauthUser: OauthUser): User {
        val user = if (oauthUser.email != null) {
            userRepository.findByGoogleIdOrEmail(oauthUser.externalId, oauthUser.email)
        } else {
            userRepository.findByGoogleId(oauthUser.externalId)
        }
        if (user != null) {
            user.email = oauthUser.email
            user.googleId = oauthUser.externalId
            return user
        }
        return userRepository.save(
            User(
                id = randomUUID(),
                googleId = oauthUser.externalId,
                email = oauthUser.email,
            )
        )
    }

    private fun saveOrUpdateOrcidUser(oauthUser: OauthUser): User {
        val user = if (oauthUser.email != null) {
            userRepository.findByOrcidIdOrEmail(oauthUser.externalId, oauthUser.email)
        } else {
            userRepository.findByOrcidId(oauthUser.externalId)
        }
        if (user != null) {
            user.email = oauthUser.email
            user.orcidId = oauthUser.externalId
            return user
        }
        return userRepository.save(
            User(
                id = randomUUID(),
                orcidId = oauthUser.externalId,
                email = oauthUser.email,
            )
        )
    }

    private fun createMessage(code: String, link: String, email: String): MimeMessage {
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
        helper.setSubject(createSubject())

        return message
    }

    private fun createSubject() = "[FirstApproval] Confirming an email address"
}

data class OauthUser(
    val externalId: String,
    val email: String?,
    val type: OauthType
)

enum class OauthType {
    GOOGLE,
    ORCID
}
