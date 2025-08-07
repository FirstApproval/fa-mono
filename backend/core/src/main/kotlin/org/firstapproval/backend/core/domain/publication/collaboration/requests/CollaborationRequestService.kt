package org.firstapproval.backend.core.domain.publication.collaboration.requests

import com.amazonaws.AmazonServiceException
import com.amazonaws.SdkClientException
import com.fasterxml.jackson.databind.ObjectMapper
import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.authors.toShortInfoApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationMessageFileRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationRequestMessageFile
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.*
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.*
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.RecipientType.DATA_USER
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.RecipientType.DATA_AUTHOR
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.PENDING
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationAuthorInvitationStatus.*
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationAuthorInvitationStatus.COLLABORATION_APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationAuthorInvitationStatus.MANUSCRIPT_APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationRequestInvitedAuthor
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationRequestInvitedAuthorRepository
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.toApiObjectWithoutPhoto
import org.firstapproval.backend.core.external.s3.COLLABORATION_REQUEST_MESSAGE_FILES
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.*
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationRequestMessage as CollaborationRequestMessageApiObject

private val DECLINE_STATUSES = listOf(COLLABORATION_DECLINED, MANUSCRIPT_DECLINED)
private val COLLABORATION_RESPONSE_STATUSES = listOf(COLLABORATION_DECLINED, COLLABORATION_APPROVED)

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val publicationRepository: PublicationRepository,
    private val publicationService: PublicationService,
    private val collaborationMessageRepository: CollaborationMessageRepository,
    private val collaborationMessageFileRepository: CollaborationMessageFileRepository,
    private val collaborationRequestInvitedAuthorRepository: CollaborationRequestInvitedAuthorRepository,
    private val fileStorageService: FileStorageService,
    private val objectMapper: ObjectMapper
) {
    @Transactional
    fun createCollaborationRequest(publicationId: String, collaborationRequestRequest: CreateCollaborationRequest, user: User) {
        val publication = publicationRepository.getReferenceById(publicationId)
        createIfAbsent(publication, collaborationRequestRequest, user)
    }

    @Transactional
    fun createCollaborationRequestMessages(
        collaborationRequest: CollaborationRequest,
        collaborationRequestMessage: CollaborationRequestMessageApiObject,
        user: User
    ): List<CollaborationRequestMessage> {
        val type = CollaborationRequestMessageType.valueOf(collaborationRequestMessage.type.name)

        // need to check that doesn't exist message with the same or higher sequenceIndex
        collaborationMessageRepository.existsByCollaborationRequestIdAndUserIdAndSequenceIndexGreaterThan(
            collaborationRequestId = collaborationRequest.id,
            userId = user.id,
            sequenceIndex = type.step
        ).also { exists -> if (exists) throw IllegalArgumentException("Message with equal or higher sequenceIndex ${type.step} already exists. Current type: $type") }

//        val messageRecipient = targetUser(type, collaborationRequest)
//        val message = CollaborationRequestMessage(
//            collaborationRequest = collaborationRequest,
//            type = type,
//            user = messageRecipient,
//            payload = objectMapper.convertValue(collaborationRequestMessage.payload, MessagePayload::class.java),
//            sequenceIndex = type.step,
//            recipientTypes = mutableSetOf(type.recipientType),
//            isAssistant = collaborationRequestMessage.isAssistant
//        )

        val message = collaborationRequestMessage(
            collaborationRequest = collaborationRequest,
            type = type,
            payload = objectMapper.convertValue(collaborationRequestMessage.payload, MessagePayload::class.java),
            targetUser = user
        )

        val additionalMessagesToSave = createAdditionalMessages(collaborationRequest, user, message)

        return collaborationMessageRepository.saveAll(additionalMessagesToSave + message)
            .filter { it.user.id == user.id }
    }

    private fun createAdditionalMessages(
        collaborationRequest: CollaborationRequest,
        user: User,
        originalMessage: CollaborationRequestMessage
    ): List<CollaborationRequestMessage> = when (originalMessage.type) {
        EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST -> {
            collaborationRequest.status = PENDING
            val authors = collaborationRequest.publication.authors
                .filter { it.user != null }
                .map { CollaborationRequestInvitedAuthor(collaborationRequest = collaborationRequest, author = it) }
            collaborationRequestInvitedAuthorRepository.saveAll(authors)

            val potentialPublicationData = collaborationRequest.messages
                .find { it.type === DONE_WHATS_NEXT }!!.payload as PotentialPublicationData
//            val iWouldLikeToIncludeYouAsCoAuthorMessage = CollaborationRequestMessage(
//                collaborationRequest = collaborationRequest,
//                type = I_WOULD_LIKE_TO_INCLUDE_YOU,
//                // make for all authors (not only creator)
//                user = targetUser(I_WOULD_LIKE_TO_INCLUDE_YOU, collaborationRequest),
//                payload = IWouldLikeToIncludeYouAsCoAuthor(
//                    potentialPublicationTitle = potentialPublicationData.potentialPublicationTitle,
//                    typeOfWork = potentialPublicationData.typeOfWork,
//                    intendedJournalForPublication = potentialPublicationData.intendedJournalForPublication,
//                    detailsOfResearch = potentialPublicationData.detailsOfResearch
//                ),
//                sequenceIndex = I_WOULD_LIKE_TO_INCLUDE_YOU.step,
//                recipientTypes = mutableSetOf(PUBLICATION_CREATOR),
//                isAssistant = true
//            )
            val iWouldLikeToIncludeYouAsCoAuthorMessages = authors.map {
                collaborationRequestMessage(
                    collaborationRequest = collaborationRequest,
                    type = I_WOULD_LIKE_TO_INCLUDE_YOU,
                    payload = IWouldLikeToIncludeYouAsCoAuthor(
                        potentialPublicationTitle = potentialPublicationData.potentialPublicationTitle,
                        typeOfWork = potentialPublicationData.typeOfWork,
                        intendedJournalForPublication = potentialPublicationData.intendedJournalForPublication,
                        detailsOfResearch = potentialPublicationData.detailsOfResearch
                    ),
                    targetUser = it.author.user
                )
            }

//            val assistantCreateMessage = CollaborationRequestMessage(
//                collaborationRequest = collaborationRequest,
//                type = ASSISTANT_CREATE,
//                // make for all authors (not only creator)
//                user = targetUser(ASSISTANT_CREATE, collaborationRequest),
//                sequenceIndex = ASSISTANT_CREATE.step,
//                recipientTypes = mutableSetOf(PUBLICATION_CREATOR),
//                isAssistant = true
//            )
            val assistantCreateMessages = authors.map {
                collaborationRequestMessage(collaborationRequest, ASSISTANT_CREATE, it.author.user)
            }
            iWouldLikeToIncludeYouAsCoAuthorMessages + assistantCreateMessages
        }

        DECLINE_COLLABORATION -> {
            val invitedAuthor = collaborationRequest.authors.find { it.author.user!!.id == user.id }!!
            invitedAuthor.status = COLLABORATION_DECLINED

            val assistantCollaborationDeclinedMessage = collaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = ASSISTANT_COLLABORATION_DECLINED,
                targetUser = user
            )
            val declinedMessage = collaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = YOUR_COLLABORATION_IS_DECLINED,
                payload = YourCollaborationIsDeclinedPayload(
                    type = YOUR_COLLABORATION_IS_DECLINED,
                    decisionAuthor = invitedAuthor.author.toShortInfoApiObject(),
                    decisionAuthorComment = null,
                    expectedApprovingAuthors = collaborationRequest.authors
                        .filter { !DECLINE_STATUSES.contains(it.status) }
                        .map { it.author.toShortInfoApiObject() }
                )
            )

            val messages = mutableListOf(declinedMessage, assistantCollaborationDeclinedMessage)
            if (collaborationRequest.authors.all { it.status == COLLABORATION_DECLINED }) {
                messages.add(collaborationRequestMessage(collaborationRequest, ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST))
            } else if (collaborationRequest.authors.all { it.status in COLLABORATION_RESPONSE_STATUSES }) {
                messages.add(collaborationRequestMessage(collaborationRequest, ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST))
            }

            messages
        }

        // тут нужно добавить сообщение для data user с информацией что все data author ответили
        APPROVE_COLLABORATION -> {
            val invitedAuthor = collaborationRequest.authors.find { it.author.user!!.id == user.id }!!
            invitedAuthor.status = COLLABORATION_APPROVED

            val authorNotifiedDeclinedMessage = collaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = YOUR_COLLABORATION_IS_ESTABLISHED,
                payload = YourCollaborationIsEstablishedPayload(author = invitedAuthor.author.toShortInfoApiObject()),
            )

//            val authorNotifiedDeclinedMessage = CollaborationRequestMessage(
//                collaborationRequest = collaborationRequest,
//                type = YOUR_COLLABORATION_IS_ESTABLISHED,
//                user = targetUser(YOUR_COLLABORATION_IS_ESTABLISHED, collaborationRequest),
//                payload = YourCollaborationIsEstablishedPayload(author = invitedAuthor.author.toShortInfoApiObject()),
//                sequenceIndex = YOUR_COLLABORATION_IS_ESTABLISHED.step,
//                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
//                isAssistant = true
//            )

            val messages = mutableListOf(authorNotifiedDeclinedMessage)
            if (collaborationRequest.authors.all { it.status in COLLABORATION_RESPONSE_STATUSES }) {
                messages.add(collaborationRequestMessage(collaborationRequest, ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST))
            }

            messages
        }

        UPLOAD_FINAL_DRAFT -> {
//            val finalDraftAttachedByDataUserMessageType = ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER
//            val finalDraftAttachedMessage = CollaborationRequestMessage(
//                collaborationRequest = collaborationRequest,
//                type = finalDraftAttachedByDataUserMessageType,
//                user = targetUser(finalDraftAttachedByDataUserMessageType, collaborationRequest),
//                payload = FinalDraftAttachedByDataUser(dataUser = user.toApiObjectWithoutPhoto()),
//                sequenceIndex = finalDraftAttachedByDataUserMessageType.step,
//                recipientTypes = mutableSetOf(PUBLICATION_CREATOR),
//                isAssistant = true
//            )
            val finalDraftAttachedMessages = collaborationRequest.authors.map {
                collaborationRequestMessage(
                    collaborationRequest = collaborationRequest,
                    type = ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER,
                    payload = FinalDraftAttachedByDataUser(user.toApiObjectWithoutPhoto()),
                    targetUser = it.author.user
                )
            }

//            val authorHas14DaysToApproveMessageType = AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE
//            val authorHas14DaysToMakeRevisionAndApproveMessage = CollaborationRequestMessage(
//                collaborationRequest = collaborationRequest,
//                type = authorHas14DaysToApproveMessageType,
//                user = targetUser(authorHas14DaysToApproveMessageType, collaborationRequest),
//                sequenceIndex = authorHas14DaysToApproveMessageType.step,
//                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
//                isAssistant = true
//            )
            val authorHas14DaysMessage = collaborationRequestMessage(collaborationRequest, AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE)

            finalDraftAttachedMessages + authorHas14DaysMessage
        }

        APPROVE_MANUSCRIPT -> {
            val payload = originalMessage.payload as ApproveManuscriptPayload
            val invitedAuthor = collaborationRequest.authors.find { it.author.user!!.id == user.id }!!
            invitedAuthor.status = MANUSCRIPT_APPROVED

            val assistantManuscriptApproved = collaborationRequestMessage(collaborationRequest, ASSISTANT_MANUSCRIPT_APPROVED, user)
            val authorNotifiedDeclinedMessage = collaborationRequestMessage(
                collaborationRequest,
                AUTHOR_APPROVED,
                payload = AuthorApprovedPayload(
                    type = AUTHOR_APPROVED,
                    decisionAuthor = invitedAuthor.author.toShortInfoApiObject(),
                    decisionAuthorComment = payload.comment,
                    expectedApprovingAuthors = collaborationRequest.authors
                        .filter { it.status == COLLABORATION_APPROVED }
                        .map { it.author.toShortInfoApiObject() }
                )
            )

            val messages = mutableListOf(authorNotifiedDeclinedMessage, assistantManuscriptApproved)
            if (collaborationRequest.authors.all { it.status == MANUSCRIPT_APPROVED }) {
                val allAuthorsConfirmedMessage = collaborationRequestMessage(collaborationRequest, ALL_AUTHORS_CONFIRMED)
                messages.add(allAuthorsConfirmedMessage)
            }

            messages
        }

        DECLINE_MANUSCRIPT -> {
            val invitedAuthor = collaborationRequest.authors.find { it.author.user!!.id == user.id }!!
            invitedAuthor.status = MANUSCRIPT_DECLINED

            val assistantCollaborationDeclinedMessage = collaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = ASSISTANT_MANUSCRIPT_DECLINED,
                targetUser = user
            )
            val declinedMessage = collaborationRequestMessage(
                collaborationRequest = collaborationRequest,
                type = AUTHOR_DECLINED,
                payload = AuthorDeclinedPayload(
                    type = AUTHOR_DECLINED,
                    decisionAuthor = invitedAuthor.author.toShortInfoApiObject(),
                    decisionAuthorComment = null,
                    expectedApprovingAuthors = collaborationRequest.authors
                        .filter { !DECLINE_STATUSES.contains(it.status) }
                        .map { it.author.toShortInfoApiObject() }
                )
            )

            listOf(assistantCollaborationDeclinedMessage, declinedMessage)
        }

        else -> emptyList()
    }

    private fun collaborationRequestMessage(
        collaborationRequest: CollaborationRequest,
        type: CollaborationRequestMessageType,
        targetUser: User? = null,
        payload: MessagePayload? = null,
    ) = CollaborationRequestMessage(
        collaborationRequest = collaborationRequest,
        type = type,
        user = targetUser(type, collaborationRequest, targetUser),
        payload = payload,
        sequenceIndex = type.step,
        isAssistant = true
    )

    private fun targetUser(
        type: CollaborationRequestMessageType,
        collaborationRequest: CollaborationRequest,
        dataAuthor: User?
    ): User {
        return when (type.recipientType) {
            DATA_USER -> collaborationRequest.user
            DATA_AUTHOR -> dataAuthor!!
        }
    }

    @Transactional(rollbackFor = [SdkClientException::class, AmazonServiceException::class])
    fun uploadMessageFile(messageId: UUID, publicationId: String, file: MultipartFile): CollaborationRequestMessageFile {
        val uploadFinalDraftMessage = collaborationMessageRepository.getReferenceById(messageId)
        val finalDraftAttachedMessage = uploadFinalDraftMessage.collaborationRequest.messages
            .find { it.type == ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER }!!

        require(publicationId == uploadFinalDraftMessage.collaborationRequest.publication.id) {
            "Publication ID does not match the message's publication."
        }

        val fileId = randomUUID()
        val uploadDraftMessageFile = CollaborationRequestMessageFile(
            fileId = fileId,
            message = uploadFinalDraftMessage,
            name = file.originalFilename!!,
            size = file.size
        )
        val finalDraftAttachedMessageFile = CollaborationRequestMessageFile(
            fileId = fileId,
            message = finalDraftAttachedMessage,
            name = file.originalFilename!!,
            size = file.size
        )

        collaborationMessageFileRepository.saveAll(listOf(uploadDraftMessageFile, finalDraftAttachedMessageFile))
        fileStorageService.save(COLLABORATION_REQUEST_MESSAGE_FILES, fileId.toString(), file.inputStream, file.size)

        return uploadDraftMessageFile
    }

    @Transactional
    fun getDownloadFileLink(collaborationRequestId: UUID, fileRecordId: UUID, user: User): String {
        val file = collaborationMessageFileRepository.getReferenceById(fileRecordId)

        assert(collaborationRequestId == file.message.collaborationRequest.id)
        assert(user.id == file.message.user.id)

        return fileStorageService.generateTemporaryDownloadLink(COLLABORATION_REQUEST_MESSAGE_FILES, file.fileId.toString(), file.name)
    }

    @Transactional
    fun get(id: UUID, user: User): CollaborationRequest {
        val collaborationRequest = collaborationRequestRepository.getReferenceById(id)
        if (collaborationRequest.user.id != user.id &&
            user.id !in collaborationRequest.authors.map { it.author.user!!.id }
        ) {
            throw IllegalAccessException("Only the creator of collaboration requests or authors of publication may access it.")
        }
        return collaborationRequest
    }

    @Transactional
    fun get(publicationId: String, userId: UUID) =
        collaborationRequestRepository.findByPublicationIdAndUserId(publicationId, userId)!!

    @Transactional
    fun getByUser(userId: UUID, page: Int, pageSize: Int) =
        collaborationRequestRepository.findByUserId(
            userId, PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )

    @Transactional
    fun findInvitation(publicationId: String, page: Int, pageSize: Int, user: User): Page<CollaborationRequestInvitedAuthor> {
        val publication = publicationService.getUserPublicationByIdAndStatus(publicationId, user)
        return collaborationRequestInvitedAuthorRepository.findByCollaborationRequestPublicationIdAndAuthorUserId(
            publication.id,
            user.id,
            PageRequest.of(page, pageSize, Sort.by(DESC, "status", "creationTime"))
        )
    }

    private fun createIfAbsent(
        publication: Publication,
        collaborationRequestRequest: CreateCollaborationRequest,
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
                description = collaborationRequestRequest.description,
                user = user
            )
        )

        // For collaboration request creator
        collaborationMessageRepository.saveAll(
            listOf(
                collaborationRequestMessage(collaboration, AGREE_TO_THE_TERMS_OF_COLLABORATION),
                collaborationRequestMessage(collaboration, DATASET_WAS_DOWNLOADED)
            )
//            CollaborationRequestMessage(
//                collaborationRequest = collaboration,
//                type = AGREE_TO_THE_TERMS_OF_COLLABORATION,
//                user = user,
//                sequenceIndex = 0,
//                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
//                isAssistant = false
//            )
        )

//        collaborationMessageRepository.save(
//            collaborationRequestMessage(collaboration, DATASET_WAS_DOWNLOADED)
//            CollaborationRequestMessage(
//                collaborationRequest = collaboration,
//                type = DATASET_WAS_DOWNLOADED,
//                user = user,
//                sequenceIndex = 1,
//                recipientTypes = mutableSetOf(COLLABORATION_REQUEST_CREATOR),
//                isAssistant = true
//            )
//        )
    }
}
