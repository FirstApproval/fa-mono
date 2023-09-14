package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PdfApi
import org.firstapproval.backend.core.infra.pdf.PdfService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class PdfController(
    private val pdfService: PdfService
) : PdfApi {

    override fun downloadPdf(id: UUID?): ResponseEntity<ByteArray> {
        return ok(pdfService.generate())
    }
}
