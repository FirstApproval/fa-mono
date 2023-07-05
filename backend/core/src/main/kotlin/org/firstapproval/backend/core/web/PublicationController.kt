package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.Publication
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class PublicationController(
    private val publicationService: PublicationService,
    private val authHolderService: AuthHolderService
) : PublicationApi {
    override fun createPublication(): ResponseEntity<Publication> {
        val pub = publicationService.createDraft(authHolderService.user)
        return ResponseEntity(Publication(pub.id), HttpStatus.OK)
    }
}
