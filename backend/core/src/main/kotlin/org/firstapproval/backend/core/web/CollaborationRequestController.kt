package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestApi
import org.firstapproval.api.server.model.CollaborationRequest
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.api.server.model.CreateCollaborationRequestRequest
import org.firstapproval.api.server.model.GetCollaborationRequestsResponse
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestService
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.REJECTED
import org.firstapproval.backend.core.domain.publication.collaboration.requests.toApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class CollaborationRequestController(
    private val collaborationRequestService: CollaborationRequestService,
    private val userService: UserService,
    private val authHolderService: AuthHolderService
) : CollaborationRequestApi {
    override fun approveCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<Void> {
        collaborationRequestService.makeDecision(collaborationRequestId, APPROVED, authHolderService.user)
        return ok().build()
    }

    override fun rejectCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<Void> {
        collaborationRequestService.makeDecision(collaborationRequestId, REJECTED, authHolderService.user)
        return ok().build()
    }

    override fun createCollaborationRequest(
        publicationId: String,
        createCollaborationRequestRequest: CreateCollaborationRequest
    ): ResponseEntity<Void> {
        collaborationRequestService.createCollaborationRequest(
            publicationId,
            createCollaborationRequestRequest,
            authHolderService.user
        )
        return ok().build()
    }

    override fun getCollaborationRequest(collaborationRequestId: UUID): ResponseEntity<CollaborationRequestInfo> {
        return ok(collaborationRequestService.get(collaborationRequestId).toApiObject(userService = userService))
    }

    override fun getCollaborationRequests(
        publicationId: String,
        page: Int,
        pageSize: Int
    ): ResponseEntity<GetCollaborationRequestsResponse> {
        val result = collaborationRequestService.findByPublicationId(publicationId, page, pageSize)
        val collaborationRequests = result
            .map { it.toApiObject(userService = userService) }
            .toList()

        return ok(GetCollaborationRequestsResponse(result.isLast, collaborationRequests))
    }
}
