package org.firstapproval.backend.core.domain.user

import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthType.ORCID
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import java.util.*
import java.util.UUID.*

const val EMAIL_CONFIRMATION_CODE_LENGTH = 6

@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailRegistrationConfirmationRepository: EmailRegistrationConfirmationRepository,
    private val passwordResetConfirmationRepository: PasswordResetConfirmationRepository,
    private val passwordEncoder: PasswordEncoder
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
        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        val registrationToken = randomUUID()
        // TODO SEND EMAIL AND CODE
        emailRegistrationConfirmationRepository.save(
            EmailRegistrationConfirmation(
                id = registrationToken,
                email = email,
                password = passwordEncoder.encode(password),
                code = code
            )
        )
        return registrationToken
    }

    @Transactional
    fun requestPasswordReset(email: String) {
        val user = userRepository.findByEmail(email)
        val passwordResetRequestId = randomUUID()
        // TODO SEND EMAIL TO USER WITH RESET LINK
        passwordResetConfirmationRepository.save(PasswordResetConfirmation(id = passwordResetRequestId, user = user))
    }

    @Transactional
    fun resetPassword(passwordResetRequestId: UUID, password: String): User {
        val passwordResetRequest = passwordResetConfirmationRepository.getReferenceById(passwordResetRequestId)
        passwordResetRequest.user.password = passwordEncoder.encode(password)
        passwordResetConfirmationRepository.delete(passwordResetRequest)
        return passwordResetRequest.user
    }

    @Transactional(readOnly = true)
    fun checkUserEmailPassword(email: String, password: String): User {
        val user = userRepository.findByEmail(email)
        if (!passwordEncoder.matches(password, user.password)) {
            throw IllegalArgumentException("Wrong password")
        } else {
            return user
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

    fun finishRegistration(registrationToken: UUID, code: String): User {
        val emailRegistrationConfirmation = emailRegistrationConfirmationRepository.getReferenceById(registrationToken)
        if (emailRegistrationConfirmation.code != code) {
            throw AccessDeniedException("ACCESS DENIED")
        }
        return userRepository.save(
            User(
                id = randomUUID(),
                email = emailRegistrationConfirmation.email,
                password = emailRegistrationConfirmation.password
            )
        )
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