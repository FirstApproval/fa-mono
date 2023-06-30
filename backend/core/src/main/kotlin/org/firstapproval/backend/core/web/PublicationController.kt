package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.Publication
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.UUID

@RestController
class PublicationController(
    val publicationService: PublicationService
) : PublicationApi {
    override fun createPublication(): ResponseEntity<Publication> {
        val pub = publicationService.createDraft()
        return ResponseEntity(Publication(pub.id), HttpStatus.OK)
    }
}
