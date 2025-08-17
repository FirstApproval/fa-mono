package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.EmailNotificationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.EmailNotificationStatus.SENT
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate

@Service
class CollaborationMessageNotifier(
    private val notificationService: NotificationService,
    private val collaborationMessageRepository: CollaborationMessageRepository,
    private val transactionTemplate: TransactionTemplate
) {

    val log = logger {}

    @Scheduled(cron = "\${collaboration-request-messages.cron}")
    @SchedulerLock(name = "CollaborationMessageNotifier.sendMessagesToEmails")
    fun sendMessagesToEmails() {
        val messages = collaborationMessageRepository.findAllByEmailNotificationStatus(PENDING)
        messages.forEach {
            try {
                log.info("Sending mail(s) for collaboration message: ${it.id}, type: ${it.type}")
                notificationService.sendCollaborationMessage(it)
                markAsSent(it)
                log.info("Mail(s) sent successfully for collaboration message: ${it.id}, type: ${it.type}")
            } catch (e: Exception) {
                log.error { "Error sending email(s) for message: ${it.id}, type: ${it.type}" }
            }
        }
    }

    private fun markAsSent(message: CollaborationRequestMessage) {
        transactionTemplate.execute {
            message.emailNotificationStatus = SENT
            collaborationMessageRepository.save(message)
        }
    }
}
