package org.firstapproval.backend.core.web

import org.firstapproval.api.server.ReportApi
import org.firstapproval.api.server.model.CreateReportRequest
import org.firstapproval.api.server.model.ReportFile
import org.firstapproval.backend.core.domain.report.ReportService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
class ReportController(private val reportService: ReportService) : ReportApi {

    override fun uploadReportFile(contentLength: Long, file: MultipartFile): ResponseEntity<ReportFile> {
        return ok().body(ReportFile().id(reportService.uploadFile(file.inputStream, contentLength)))
    }

    override fun createReport(createReportRequest: CreateReportRequest): ResponseEntity<Void> {
        reportService.createReport(createReportRequest.email, createReportRequest.description, createReportRequest.fileIds.toList())
        return ok().build()
    }
}
