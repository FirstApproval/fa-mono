package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestApi
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.backend.core.domain.publication.collaborator.requests.CollaborationRequestService
import org.firstapproval.backend.core.domain.publication.collaborator.requests.toApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class CollaborationRequestController(
    private val collaborationRequestService: CollaborationRequestService,
    private val userService: UserService
) : CollaborationRequestApi {
    override fun approveCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<Void> {
        collaborationRequestService.approve(collaborationRequestId)
        return ok().build()
    }

    override fun createCollaborationRequest(publicationId: String): ResponseEntity<Void> {
        collaborationRequestService.createCollaborationRequest(publicationId)
        return ok().build()
    }

    override fun rejectCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<Void> {
        collaborationRequestService.reject(collaborationRequestId)
        return ok().build()
    }

    override fun getCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<CollaborationRequestInfo> {
        return ok(collaborationRequestService.get(collaborationRequestId).toApiObject(userService = userService))
    }
}
