package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.CreatePublicationResponse
import org.firstapproval.api.server.model.Publication
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.toApiObject
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class PublicationController(
    private val publicationService: PublicationService,
    private val authHolderService: AuthHolderService
) : PublicationApi {
    override fun createPublication(): ResponseEntity<CreatePublicationResponse> {
        val pub = publicationService.create(authHolderService.user)
        return ResponseEntity(CreatePublicationResponse(pub.id), HttpStatus.OK)
    }

    override fun editPublication(id: UUID, publicationEditRequest: PublicationEditRequest): ResponseEntity<Void> {
        publicationService.edit(id, publicationEditRequest)
        return ok().build()
    }

    override fun getPublocation(id: UUID): ResponseEntity<Publication> {
        return ok(publicationService.get(id).toApiObject())
    }
}
