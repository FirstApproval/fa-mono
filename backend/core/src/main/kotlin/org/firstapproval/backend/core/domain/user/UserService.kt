package org.firstapproval.backend.core.domain.user

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.OauthType.FACEBOOK
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
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
    private val authorizationLimitRepository: AuthorizationLimitRepository
) {

    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        val userSupplier = when (oauthUser.type) {
            GOOGLE -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByGoogleIdOrEmail(oauthUser.externalId, oauthUser.email)
                } else {
                    userRepository.findByGoogleId(oauthUser.externalId)
                }
            }

            FACEBOOK -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByFacebookIdOrEmail(oauthUser.externalId, oauthUser.email)
                } else {
                    userRepository.findByFacebookId(oauthUser.externalId)
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
    fun startUserRegistration(email: String, password: String): UUID {
        val prevTry = emailRegistrationConfirmationRepository.findByEmail(email)
        if (prevTry != null) {
            if (prevTry.attemptCount >= SEND_EMAIL_LIMIT) {
                throw LimitExceededException("limit exceeded")
            }
            if (userRepository.existsByEmail(prevTry.email)) {
                throw RecordConflictException("user already exists")
            }
            prevTry.lastTryTime = now()
            prevTry.attemptCount += 1
            prevTry.password = passwordEncoder.encode(password)
            // TODO SEND EMAIL AND CODE
            return prevTry.id
        } else {
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
                    code = code
                )
            )
            // TODO SEND EMAIL AND CODE
            return registrationToken
        }
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
                username = if (userByUsername != null) userId.toString() else username
            )
        )
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
                email = oauthUser.email,
                firstName = oauthUser.firstName,
                lastName = oauthUser.lastName,
                middleName = oauthUser.middleName,
                fullName = oauthUser.fullName
            )
        )
    }
}

enum class OauthType {
    GOOGLE,
    FACEBOOK
}
