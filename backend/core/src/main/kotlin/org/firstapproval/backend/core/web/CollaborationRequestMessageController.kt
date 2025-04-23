package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestMessageApi
import org.firstapproval.api.server.model.GetCollaborationRequestMessagesResponse
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationMessageRepository
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.toApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class CollaborationRequestMessageController(
    private val collaborationRequestMessageRepository: CollaborationMessageRepository,
    private val userService: UserService
) : CollaborationRequestMessageApi {
    override fun getCollaborationRequestMessages(collaborationRequestId: UUID): ResponseEntity<GetCollaborationRequestMessagesResponse> {
        val messages = collaborationRequestMessageRepository.findAllByCollaborationRequestIdOrderByCreationTimeDesc(collaborationRequestId)
            .map { it.toApiObject(userService) }
        return ok(GetCollaborationRequestMessagesResponse(messages))
    }
}
