package org.firstapproval.backend.core.domain.moderation

import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationPdfService
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.MODERATION
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now

@Service
class ModerationService(
    private val publicationRepository: PublicationRepository,
    private val publicationPdfService: PublicationPdfService,
    private val notificationService: NotificationService,
) {

    @Transactional(readOnly = true)
    fun getPublication(id: String) = publicationRepository.getReferenceById(id)

    fun generatePdf(publication: Publication): ByteArray = publicationPdfService.generate(publication)

    @Transactional
    fun publishPublication(id: String) {
        val publication = publicationRepository.getReferenceById(id)
        if (publication.status == MODERATION) {
            publication.status = PUBLISHED
            publication.publicationTime = now()
            publicationRepository.save(publication)
            notificationService.sendEmailForCoAuthorsChanged(publication)
            notificationService.sendPublicationPassedModeration(publication)
        } else {
            throw AccessDeniedException("Forbidden publish draft publications. Only draft publications can be published")
        }
    }

    @Transactional
    fun blockPublication(id: String) {
        val publication = publicationRepository.getReferenceById(id)
        if (publication.status == PENDING) {
            throw AccessDeniedException("Forbidden block draft publications. Only published publications can be blocked")
        }
        publication.isBlocked = true
        publicationRepository.save(publication)
    }
}
