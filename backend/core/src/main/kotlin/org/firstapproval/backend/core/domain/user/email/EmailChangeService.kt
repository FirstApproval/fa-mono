package org.firstapproval.backend.core.domain.user.email

import jakarta.transaction.Transactional
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.EMAIL_CONFIRMATION_CODE_LENGTH
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.UUID.randomUUID


@Service
class EmailChangeService(
    private val frontendProperties: FrontendProperties,
    private val userRepository: UserRepository,
    private val emailChangeConfirmationRepository: EmailChangeConfirmationRepository,
    private val notificationService: NotificationService,
    private val authHolderService: AuthHolderService,
) {

    @Transactional
    fun createChangeEmailRequest(email: String): UUID {
        if (userRepository.existsByEmail(email)) {
            throw RecordConflictException("user already exists")
        }

        val code = generateCode(EMAIL_CONFIRMATION_CODE_LENGTH)
        val id = randomUUID()

        emailChangeConfirmationRepository.deleteByUserId(authHolderService.user.id)
        emailChangeConfirmationRepository.save(
            EmailChangeConfirmation(
                id = id,
                email = email,
                code = code,
                user = authHolderService.user
            )
        )
        val link = "${frontendProperties.emailChangeConfirmationUrl}${id}/${code}"

        notificationService.sendConfirmationEmail(code, link, email, "email-template")

        return id
    }

    @Transactional
    fun confirmChangeEmailRequest(confirmationToken: UUID, code: String) {
        val emailChangeConfirmation = emailChangeConfirmationRepository.getReferenceById(confirmationToken)
        if (emailChangeConfirmation.code != code) {
            throw AccessDeniedException("access denied")
        }
        if (userRepository.existsByEmail(emailChangeConfirmation.email)) {
            throw RecordConflictException("user already exists")
        }

        emailChangeConfirmation.user.email = emailChangeConfirmation.email

        emailChangeConfirmationRepository.delete(emailChangeConfirmation)
    }
}
