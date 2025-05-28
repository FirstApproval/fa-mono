package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.checkPublicationCreator
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.Create
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.MessageType
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.NEW
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.DECLINED
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
        if (collaborationRequestStatus !in listOf(APPROVED, DECLINED)) {
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

        val fullNameRequestCreator = "${collaborationRequestRequest.firstNameLegal} ${collaborationRequestRequest.lastNameLegal}"
        collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaboration,
                type = MessageType.ASSISTANT_CREATE,
                user = user,
                text = "$fullNameRequestCreator plans to use your dataset in his research and wants to include you " +
                    "as a co-author of his article.\n" +
                    "This is First Approval collaboration agreement pre-filled by $fullNameRequestCreator :" +
                    "By approving to the collaboration, you oblige data user to include you as a co-author.\n" +
                    "The data user will also be required to provide a 14-day notice before sending you " +
                    "the final version of the article.\n" +
                    "By declining a collaboration, you oblige data user to simply quote your dataset, " +
                    "without specifying you as a co-author.",
                sequenceIndex = 1
            )
        )
    }

    @Transactional
    fun get(id: UUID) = collaborationRequestRepository.getReferenceById(id)

    @Transactional
    fun getByUser(userId: UUID) = collaborationRequestRepository.findByUserId(userId)

    @Transactional
    fun findByPublicationId(publicationId: String, page: Int, pageSize: Int, user: User): Page<CollaborationRequest> {
        val publication = publicationRepository.findByIdAndStatus(publicationId, PUBLISHED)
        checkPublicationCreator(user, publication)
        return collaborationRequestRepository.findByPublicationIdAndStatusIn(
            publicationId,
            setOf(NEW, APPROVED, DECLINED),
            PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )
    }
}
