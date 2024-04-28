package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.*
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val publicationRepository: PublicationRepository
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
    fun get(id: UUID) = collaborationRequestRepository.getReferenceById(id)

    @Transactional
    fun findByPublicationId(publicationId: String, page: Int, pageSize: Int): Page<CollaborationRequest> {
        return collaborationRequestRepository.findByPublicationIdAndStatusIn(
            publicationId,
            setOf(PENDING, APPROVED),
            PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )
    }
}
