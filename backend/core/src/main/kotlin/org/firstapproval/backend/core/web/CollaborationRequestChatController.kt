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

    override fun getCollaborationChatByPublicationId(publicationId: String): ResponseEntity<CollaborationChatResponse> {
        val collaborationRequest = collaborationRequestService.get(publicationId, authHolderService.user.id)
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
        val mappedMessages = messages.map { it.toApiObject(authHolderService.user.toApiObject(userService)) }
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

    override fun getCollaborationRequestAgreement(publicationId: String, collaborationRequestId: UUID): ResponseEntity<Resource> {
//        val resource = ClassPathResource(AGREEMENT_TEMPLATE)
//        if (!resource.exists()) {
//            return ResponseEntity.notFound().build();
//        }
        val params = createParamsMap(collaborationRequestId)
        val resource = docxPdfGenerator.generate(AGREEMENT_TEMPLATE, params)

        return ok()
            .contentType(APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=FA_Collaboration_Agreement_template.pdf")
            .body(resource);
    }

    private fun createParamsMap(collaborationRequestId: UUID): Map<String, String> {
        val collaborationRequest = collaborationRequestService.get(collaborationRequestId)
        val publication = collaborationRequest.publication
        val publicationCreator = collaborationRequest.publication.creator
        val messageByType = collaborationRequest.messages.associateBy { it.type }
        val typeOfWork =collaborationRequest.typeOfWork.name.lowercase().replaceFirstChar { it.uppercase() }.replace('_', ' ')
        val paramsMap = mutableMapOf<String, String>()

        val requestCreationDate = messageByType[EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST]!!.creationTime.format(ofPattern(DATE_PATTERN))
        val personalData = messageByType[I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL]!!.payload as PersonalDataConfirmation

        paramsMap["collaborationRequestCreationDate"] = requestCreationDate
        paramsMap["dataUserFullName"] = "${personalData.firstName} ${personalData.lastName}"
        paramsMap["dataUserAffiliations"] = personalData.workplaces.map { it.format() }.joinToString { ". " }
        paramsMap["dataAuthorFullName"] = "${publicationCreator.firstName} ${publicationCreator.lastName}"
        paramsMap["dataAuthorAffiliations"] = publicationCreator.workplacesNames
        paramsMap["publicationTitle"] = publication.title!!
        paramsMap["doiLink"] = doiProperties.linkTemplate.format(publication.id)
        paramsMap["typeOfWork"] = typeOfWork
        paramsMap["publicationDescriptionOfWork"] = typeOfWork
        paramsMap["publicationDescriptionOfIntendedUse"] = typeOfWork

        return paramsMap
    }

    private fun getRecipientType(collaborationRequest: CollaborationRequest) =
        when (authHolderService.user.id) {
            collaborationRequest.user.id -> COLLABORATION_REQUEST_CREATOR
            collaborationRequest.publication.creator.id -> PUBLICATION_CREATOR
            else -> throw IllegalAccessException("Only publication collaboration request creator have access")
        }

    fun Workplace.format() = "${organization.name}, $department, $address"
}
