package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestChatApi
import org.firstapproval.api.server.model.CollaborationChatResponse
import org.firstapproval.api.server.model.CollaborationRequestMessage
import org.firstapproval.api.server.model.CollaborationRequestMessageFile
import org.firstapproval.api.server.model.Workplace
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.toApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.PotentialPublicationData
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.DONE_WHATS_NEXT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.PersonalDataConfirmation
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.COLLABORATION_REQUEST_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.PUBLICATION_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.toApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestService
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.firstapproval.backend.core.infra.pdf.DocxPdfGenerator
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType.APPLICATION_PDF
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.time.format.DateTimeFormatter.ofPattern
import java.util.UUID

const val AGREEMENT_TEMPLATE = "templates/pdf/FA_Collaboration_Agreement.docx"
const val DATE_PATTERN = "d MMM uuuu"

@RestController
class CollaborationRequestChatController(
    private val collaborationRequestService: CollaborationRequestService,
    private val collaborationRequestMessageRepository: CollaborationMessageRepository,
    private val userService: UserService,
    private val authHolderService: AuthHolderService,
    private val docxPdfGenerator: DocxPdfGenerator,
    private val doiProperties: DoiProperties
) : CollaborationRequestChatApi {

    override fun getCollaborationChatByPublicationId(publicationId: String) =
        getCollaboration { collaborationRequestService.get(publicationId, authHolderService.user.id) }

    override fun getCollaborationChatById(collaborationRequestId: UUID) =
        getCollaboration { collaborationRequestService.get(collaborationRequestId, authHolderService.user) }

    override fun createCollaborationRequestMessage(
        publicationId: String,
        collaborationRequestMessage: CollaborationRequestMessage
    ): ResponseEntity<CollaborationRequestMessage> {
        val message = collaborationRequestService.createCollaborationRequestMessage(
            publicationId = publicationId,
            collaborationRequestMessage = collaborationRequestMessage,
            user = authHolderService.user
        )
        return ok(message.toApiObject(authHolderService.user.toApiObject(userService)))
    }

    override fun createCollaborationRequestMessages(
        publicationId: String,
        collaborationRequestMessages: List<CollaborationRequestMessage>
    ): ResponseEntity<List<CollaborationRequestMessage>> {
        val messages = collaborationRequestMessages.map {
            collaborationRequestService.createCollaborationRequestMessage(
                publicationId = publicationId,
                collaborationRequestMessage = it,
                user = authHolderService.user
            )
        }
        val mappedUser = authHolderService.user.toApiObject(userService)
        val mappedMessages = messages.map { it.toApiObject(mappedUser) }
        return ok(mappedMessages)
    }

    override fun uploadCollaborationRequestMessageFile(
        publicationId: String,
        file: MultipartFile,
        messageId: UUID
    ): ResponseEntity<CollaborationRequestMessageFile> {
        val savedFileRecord = collaborationRequestService.uploadMessageFile(
            messageId = messageId,
            publicationId = publicationId,
            file = file
        ).toApiObject()
        return ok(savedFileRecord)
    }

    override fun getCollaborationRequestAgreement(
        publicationId: String,
        collaborationRequestId: UUID,
        authorId: UUID
    ): ResponseEntity<Resource> {
        val params = createParamsMap(collaborationRequestId, authorId)
        val resource = docxPdfGenerator.generate(AGREEMENT_TEMPLATE, params)
        return ok()
            .contentType(APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=FA_Collaboration_Agreement_${publicationId}.pdf")
            .body(resource);
    }

    override fun getCollaborationFileDownloadLink(
        publicationId: String,
        collaborationRequestId: UUID,
        fileId: UUID
    ): ResponseEntity<String> {
        val downloadLink = collaborationRequestService.getDownloadFileLink(collaborationRequestId, fileId, authHolderService.user)
        return ok(downloadLink)
    }

    private fun getCollaboration(collaborationSupplier: () -> CollaborationRequest): ResponseEntity<CollaborationChatResponse> {
        val collaborationRequest = collaborationSupplier()
        val messages = collaborationRequestMessageRepository
            .findAllByCollaborationRequestIdAndUserIdOrderByCreationTime(collaborationRequest.id, authHolderService.user.id)
        val publicationCreator = collaborationRequest.publication.creator.toApiObject(userService)
        val collaborationRequestCreator = collaborationRequest.user.toApiObject(userService)
        val messageAuthorById = mapOf(
            publicationCreator.id to publicationCreator,
            collaborationRequestCreator.id to collaborationRequestCreator
        )
        val response = CollaborationChatResponse(
            collaborationRequest.id,
            publicationCreator,
            collaborationRequestCreator,
            messages.map {
                val messageAuthor = messageAuthorById[it.user.id]!!
                it.toApiObject(messageAuthor)
            }
        )
        return ok(response)
    }

    private fun createParamsMap(collaborationRequestId: UUID, authorId: UUID): Map<String, String> {
        val collaborationRequest = collaborationRequestService.get(collaborationRequestId, authHolderService.user)
        val publication = collaborationRequest.publication
        val author = publication.authors.find { it.id == authorId }!!//collaborationRequest.publication.creator
        val messageByType = collaborationRequest.messages.associateBy { it.type }
        val paramsMap = mutableMapOf<String, String>()

        val requestCreationDate = messageByType[EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST]
            ?.creationTime?.format(ofPattern(DATE_PATTERN)) ?: "_"
        val personalData = messageByType[I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL]!!.payload as PersonalDataConfirmation
        val potentialPublicationData = messageByType[DONE_WHATS_NEXT]!!.payload as PotentialPublicationData
        val dataUserAffiliations = personalData.workplaces.joinToString(separator = ". ", prefix = ", ") { it.format() }
        val typeOfWork = potentialPublicationData.typeOfWork.name.lowercase().replaceFirstChar { it.uppercase() }.replace('_', ' ')

        paramsMap["collaborationRequestCreationDate"] = requestCreationDate
        paramsMap["dataUserFullName"] = "${personalData.firstName} ${personalData.lastName}"
        paramsMap["dataUserAffiliations"] = dataUserAffiliations
        paramsMap["dataAuthorFullName"] = "${author.firstName} ${author.lastName}"
        paramsMap["dataAuthorAffiliations"] = author.user!!.workplacesNamesWithAddress.let { ", $it" }
        paramsMap["doiLink"] = doiProperties.linkTemplate.format(publication.id)
        paramsMap["typeOfWork"] = typeOfWork
        paramsMap["publicationTitle"] = potentialPublicationData.potentialPublicationTitle
        paramsMap["publicationDescriptionOfWork"] = potentialPublicationData.detailsOfResearch
        paramsMap["publicationDescriptionOfIntendedUse"] = potentialPublicationData.intendedJournalForPublication
        return paramsMap
    }

    private fun getRecipientType(collaborationRequest: CollaborationRequest) =
        when (authHolderService.user.id) {
            collaborationRequest.user.id -> COLLABORATION_REQUEST_CREATOR
            collaborationRequest.publication.creator.id -> PUBLICATION_CREATOR
            else -> throw IllegalAccessException("Only publication collaboration request creator have access")
        }

    fun Workplace.format(): String =
        listOfNotNull(organization.name, department, address)
            .filter { it.isNotBlank() }
            .joinToString(", ")
}
