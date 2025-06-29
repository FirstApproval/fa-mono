package org.firstapproval.backend.core.web

import org.firstapproval.api.server.CollaborationRequestApi
import org.firstapproval.api.server.model.AuthorShortInfo
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.api.server.model.CreateCollaborationRequest
import org.firstapproval.api.server.model.GetCollaborationRequestsResponse
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestService
import org.firstapproval.backend.core.domain.publication.collaboration.requests.toApiObject
import org.firstapproval.backend.core.domain.publication.toShortInfoApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class CollaborationRequestController(
    private val collaborationRequestService: CollaborationRequestService,
    private val userService: UserService,
    private val authHolderService: AuthHolderService,
    private val publicationRepository: PublicationRepository,
) : CollaborationRequestApi {

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

    override fun getPublicationCollaborationRequests(
        publicationId: String,
        page: Int,
        pageSize: Int
    ): ResponseEntity<GetCollaborationRequestsResponse> {
        val result = collaborationRequestService.findByPublicationId(publicationId, page, pageSize, authHolderService.user)
        val collaborationRequests = result
            .map { it.toApiObject(userService = userService) }
            .toList()

        return ok(GetCollaborationRequestsResponse(result.isLast, collaborationRequests))
    }

    override fun getMyCollaborationRequests(page: Int, pageSize: Int): ResponseEntity<GetCollaborationRequestsResponse> {
        val result = collaborationRequestService.getByUser(authHolderService.user.id, page, pageSize)

        val userInfo = authHolderService.user.toApiObject(userService)

        val collaborationRequests = result.map { it.toApiObject(userInfo) }.toList()

        return ok(GetCollaborationRequestsResponse(result.isLast, collaborationRequests))
    }

    override fun getPublicationAuthors(publicationId: String): ResponseEntity<MutableList<AuthorShortInfo>> {
        val authors = publicationRepository.getReferenceById(publicationId).authors.map { it.toShortInfoApiObject() }.toMutableList()
        return ok(authors)
    }
}
