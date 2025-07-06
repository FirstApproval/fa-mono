package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.api.server.model.CollaborationRequestMessage as CollaborationRequestMessageApiObject
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.AGREE_TO_THE_TERMS_OF_COLLABORATION
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.DATASET_WAS_DOWNLOADED
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.COLLABORATION_REQUEST_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.PUBLICATION_CREATOR
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

const val I_AGREE_WITH_TERMS = "I agree to the terms of the First Approval Collaboration License, " +
    "including sending a Collaboration Request to the Data Author(s)."
const val PLANS_TO_USE_YOUR_DATASET = "%1\$s plans to use your dataset in his research and wants to include you " +
    "as a co-author of his article.\n" +
    "This is First Approval collaboration agreement pre-filled by %1\$s :" +
    "By approving to the collaboration, you oblige data user to include you as a co-author.\n" +
    "The data user will also be required to provide a 14-day notice before sending you " +
    "the final version of the article.\n" +
    "By declining a collaboration, you oblige data user to simply quote your dataset, " +
    "without specifying you as a co-author."
const val ASSISTANT_DATASET_WAS_DOWNLOADED = "The dataset %1\$s was downloaded.\n\n" +
    "Important note: By incorporating this Dataset into your work or using it as a part of your larger Dataset you undertake to send " +
    "the Data Author(s) a Collaboration Request. This may result in including the Data Author(s) as co-author(s) to your work. " +
    "Read more about Collaboration..."

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val publicationRepository: PublicationRepository,
    private val publicationService: PublicationService,
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
        createIfAbsent(publication, collaborationRequestRequest, typeOfWork, user)
    }

    @Transactional
    fun createCollaborationRequestMessage(
        publicationId: String,
        collaborationRequestMessage: CollaborationRequestMessageApiObject,
        user: User
    ): CollaborationRequestMessage {
        val collaborationRequest = collaborationRequestRepository.findByPublicationIdAndUserId(publicationId, user.id)!!

        val type = CollaborationRequestMessageType.valueOf(collaborationRequestMessage.type.name)

        // need to check that doesn't exist message with the same or higher sequenceIndex
        collaborationMessageRepository.existsByCollaborationRequestIdAndUserIdAndSequenceIndexGreaterThanEqual(
            collaborationRequestId = collaborationRequest.id,
            userId = user.id,
            sequenceIndex = type.sequenceIndex
        ).also { exists -> if (exists) throw IllegalArgumentException("Message with equal or higher sequenceIndex already exists") }

        return collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = type,
                user = user,
                text = collaborationRequestMessage.text,
                sequenceIndex = type.sequenceIndex,
                recipientTypes = mutableSetOf(PUBLICATION_CREATOR),
                isAssistant = collaborationRequestMessage.isAssistant
            )
        )
    }

    @Transactional
    fun get(id: UUID) = collaborationRequestRepository.getReferenceById(id)

    @Transactional
    fun get(publicationId: String, userId: UUID) =
        collaborationRequestRepository.findByPublicationIdAndUserId(publicationId, userId)!!

    @Transactional
    fun getByUser(userId: UUID, page: Int, pageSize: Int) =
        collaborationRequestRepository.findByUserId(
            userId, PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )

    @Transactional
    fun findByPublicationId(publicationId: String, page: Int, pageSize: Int, user: User): Page<CollaborationRequest> {
        val publication = publicationService.getUserPublicationByIdAndStatus(publicationId, user)
        return collaborationRequestRepository.findByPublicationIdAndStatusIn(
            publication.id,
            setOf(NEW, APPROVED, DECLINED),
            PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )
    }

    private fun createIfAbsent(
        publication: Publication,
        collaborationRequestRequest: CreateCollaborationRequest,
        typeOfWork: TypeOfWork,
        user: User
    ) {
        if (collaborationRequestRepository.existsByPublicationAndUser(publication, user)) {
            return
        }

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

//        collaborationMessageRepository.save(
//            CollaborationRequestMessage(
//                collaborationRequest = collaboration,
//                type = MessageType.CREATE,
//                user = user,
//                text = collaborationRequestRequest.description,
//                payload = Create(
//                    collaborationRequestRequest.firstNameLegal,
//                    collaborationRequestRequest.lastNameLegal,
//                    typeOfWork,
//                    collaborationRequestRequest.description
//                ),
//                sequenceIndex = 0,
//                recipients = mutableSetOf(COLLABORATION_REQUEST_CREATOR)
//            )
//        )

        // For collaboration request creator
        collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaboration,
                type = AGREE_TO_THE_TERMS_OF_COLLABORATION,
                user = user,
                text = I_AGREE_WITH_TERMS,
                sequenceIndex = 0,
                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
                isAssistant = false
            )
        )

        collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaboration,
                type = DATASET_WAS_DOWNLOADED,
                user = user,
                text = ASSISTANT_DATASET_WAS_DOWNLOADED.format(publication.title),
                sequenceIndex = 1,
                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
                isAssistant = true
            )
        )

        // For publication creator
        val fullNameRequestCreator = "${collaborationRequestRequest.firstNameLegal} ${collaborationRequestRequest.lastNameLegal}"
        collaborationMessageRepository.save(
            CollaborationRequestMessage(
                collaborationRequest = collaboration,
                type = CollaborationRequestMessageType.ASSISTANT_CREATE,
                user = user,
                text = PLANS_TO_USE_YOUR_DATASET.format(fullNameRequestCreator),
                sequenceIndex = 1,
                recipientTypes = mutableSetOf(PUBLICATION_CREATOR),
                isAssistant = true
            )
        )
    }
}
