package org.firstapproval.backend.core.domain.report

import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.REPORT_FILES
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class ReportService(private val fileStorageService: FileStorageService, private val reportRepository: ReportRepository) {

    fun uploadFile(data: InputStream, contentLength: Long): UUID {
        val id = randomUUID()
        fileStorageService.save(REPORT_FILES, id.toString(), data, contentLength)
        return id
    }

    @Transactional
    fun createReport(email: String, description: String, fileIds: List<String>) =
        reportRepository.save(Report(email = email, description = description, fileIds = fileIds))
}
