package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.api.server.model.CreateCollaborationRequest
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
    fun makeDecision(collaborationRequestId: UUID, collaborationRequestStatus: CollaborationRequestStatus, authorResponse: String, user: User) {
        val collaborationRequest: CollaborationRequest = collaborationRequestRepository.getReferenceById(collaborationRequestId)
        if (collaborationRequest.publication.creator.id != user.id) {
            throw IllegalAccessException("Only the creator of the publication can approve or reject a collaboration request.")
        }
        if (collaborationRequestStatus !in listOf(ACCEPTED, REJECTED)) {
            throw IllegalArgumentException("Status must be APPROVED or REJECT, but status is $collaborationRequestStatus.")
        }

        collaborationRequest.decisionTime = ZonedDateTime.now()
        collaborationRequest.status = collaborationRequestStatus
        collaborationRequest.authorResponse = authorResponse

        collaborationRequest.publication.collaboratorsCount += 1
    }

    @Transactional
    fun createCollaborationRequest(publicationId: String, collaborationRequestRequest: CreateCollaborationRequest, user: User) {
        val publication = publicationRepository.getReferenceById(publicationId)
        collaborationRequestRepository.save(
            CollaborationRequest(
                publication = publication,
                firstNameLegal = collaborationRequestRequest.firstNameLegal,
                lastNameLegal = collaborationRequestRequest.lastNameLegal,
                typeOfWork = TypeOfWork.valueOf(collaborationRequestRequest.typeOfWork.name),
                description = collaborationRequestRequest.description,
                user = user
            )
        )
    }

    @Transactional
    fun get(id: UUID) = collaborationRequestRepository.getReferenceById(id)

    @Transactional
    fun findByPublicationId(publicationId: String, page: Int, pageSize: Int): Page<CollaborationRequest> {
        return collaborationRequestRepository.findByPublicationIdAndStatusIn(
            publicationId,
            setOf(PENDING, ACCEPTED),
            PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )
    }
}
