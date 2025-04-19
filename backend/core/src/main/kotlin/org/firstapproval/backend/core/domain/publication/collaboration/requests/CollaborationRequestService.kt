package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.Create
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.MessageType
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.ACCEPTED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.PENDING
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.REJECTED
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.UUID

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val publicationRepository: PublicationRepository,
    private val collaborationMessageRepository: CollaborationMessageRepository,
) {
    @Transactional
    fun makeDecision(
        collaborationRequestId: UUID,
        collaborationRequestStatus: CollaborationRequestStatus,
        authorResponse: String,
        user: User
    ) {
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
        val typeOfWork = TypeOfWork.valueOf(collaborationRequestRequest.typeOfWork.name)
        val collaboration = collaborationRequestRepository.save(
            CollaborationRequest(
                publication = publication,
                firstNameLegal = collaborationRequestRequest.firstNameLegal,
                lastNameLegal = collaborationRequestRequest.lastNameLegal,
                typeOfWork = typeOfWork,
                description = collaborationRequestRequest.description,
                user = user
            )
        )

        collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaboration,
                type = MessageType.CREATE,
                user = user,
                text = collaborationRequestRequest.description,
                payload = Create(
                    collaborationRequestRequest.firstNameLegal,
                    collaborationRequestRequest.lastNameLegal,
                    typeOfWork,
                    collaborationRequestRequest.description
                ),
                sequenceIndex = 0
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
