package org.firstapproval.backend.core.web

import org.firstapproval.api.server.ModerationApi
import org.firstapproval.backend.core.domain.moderation.ModerationService
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.Resource
import org.springframework.http.MediaType.APPLICATION_PDF
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class ModerationController(
    private val moderationService: ModerationService
) : ModerationApi {

    override fun moderationPublishPublication(id: String): ResponseEntity<Void> {
        moderationService.publishPublication(id)
        return ok().build()
    }

    override fun moderationBlockPublication(id: String): ResponseEntity<Void> {
        moderationService.blockPublication(id)
        return ok().build()
    }

    override fun moderationDownloadPdf(id: String): ResponseEntity<Resource> {
        val publication = moderationService.getPublication(id)
        val pdfContent = moderationService.generatePdf(publication)
        return ok()
            .contentType(APPLICATION_PDF)
            .header("Content-disposition", "attachment; filename=\"${publication.title ?: publication.id}.pdf\"")
            .contentLength(pdfContent.size.toLong())
            .body(ByteArrayResource(pdfContent))
    }
}
