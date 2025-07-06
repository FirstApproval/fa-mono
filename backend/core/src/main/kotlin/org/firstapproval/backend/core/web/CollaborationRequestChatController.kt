package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestChatApi
import org.firstapproval.api.server.model.CollaborationChatResponse
import org.firstapproval.api.server.model.CollaborationRequestMessage
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.COLLABORATION_REQUEST_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.PUBLICATION_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.toApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestService
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class CollaborationRequestChatController(
    private val collaborationRequestService: CollaborationRequestService,
    private val collaborationRequestMessageRepository: CollaborationMessageRepository,
    private val userService: UserService,
    private val authHolderService: AuthHolderService,
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

    private fun getRecipientType(collaborationRequest: CollaborationRequest) =
        when (authHolderService.user.id) {
            collaborationRequest.user.id -> COLLABORATION_REQUEST_CREATOR
            collaborationRequest.publication.creator.id -> PUBLICATION_CREATOR
            else -> throw IllegalAccessException("Only publication collaboration request creator have access")
        }
}
