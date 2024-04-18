package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.REJECTED
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.UUID

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val publicationRepository: PublicationRepository,
    private val publicationService: PublicationService,
    private val authHolderService: AuthHolderService
) {
    @Transactional
    fun makeDecision(collaborationRequestId: UUID, status: CollaborationRequestStatus, user: User) {
        val collaborationRequest: CollaborationRequest = collaborationRequestRepository.getReferenceById(collaborationRequestId)
        if (collaborationRequest.publication.creator.id != user.id) {
            throw IllegalAccessException("Only the creator of the publication can approve or reject a collaboration request.")
        }
        if (status !in listOf(APPROVED, REJECTED)) {
            throw IllegalArgumentException("Status must be APPROVED or REJECT, but status is $status.")
        }

        collaborationRequest.decisionTime = ZonedDateTime.now()
        collaborationRequest.status = status

        collaborationRequest.publication.collaboratorsCount += 1
    }

    @Transactional
    fun createCollaborationRequest(publicationId: String, user: User) {
        val publication = publicationRepository.getReferenceById(publicationId)
        collaborationRequestRepository.save(
            CollaborationRequest(
                publication = publication,
                user = user,
            )
        )
    }

    @Transactional
    fun get(id: UUID): CollaborationRequest {
        return collaborationRequestRepository.getReferenceById(id)
    }

    @Transactional
    fun findByPublicationId(publicationId: String, page: Int, pageSize: Int): Page<CollaborationRequest> {
        return collaborationRequestRepository.findByPublicationId(publicationId, PageRequest.of(page, pageSize))
    }
}
