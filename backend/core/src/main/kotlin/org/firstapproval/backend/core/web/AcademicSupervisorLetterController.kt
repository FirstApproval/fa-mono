package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AcademicSupervisorLetterApi
import org.firstapproval.api.server.model.AcademicSupervisorLetter
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.letters.AcademicSupervisorLetterService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.firstapproval.backend.core.domain.publication.letters.toApiObject
import org.springframework.http.ResponseEntity.ok
import java.util.UUID

@RestController
class AcademicSupervisorLetterController(
    private val academicSupervisorLetterService: AcademicSupervisorLetterService,
    private val authHolderService: AuthHolderService
): AcademicSupervisorLetterApi {
    override fun uploadAcademicSupervisorLetter(
        publicationId: String,
        academicSupervisorName: String,
        file: MultipartFile
    ): ResponseEntity<AcademicSupervisorLetter> {
        val savedLetter = academicSupervisorLetterService.upload(
            publicationId = publicationId,
            academicSupervisorName = academicSupervisorName,
            user = authHolderService.user,
            file = file
        )
        return ok().body(savedLetter.toApiObject())
    }

    override fun getAcademicSupervisorLetters(publicationId: String): ResponseEntity<List<AcademicSupervisorLetter>> {
        val letters = academicSupervisorLetterService.get(publicationId, authHolderService.user).map { it.toApiObject() }.toList()
        return ok().body(letters)
    }

    override fun deleteAcademicSupervisorLetter(publicationId: String, letterId: UUID): ResponseEntity<Void> {
        academicSupervisorLetterService.delete(letterId, publicationId, authHolderService.user)
        return ok().build()
    }

    override fun downloadAcademicSupervisorLetter(publicationId: String, letterId: UUID): ResponseEntity<String> {
        val downloadLink = academicSupervisorLetterService.getDownloadLink(letterId, publicationId, authHolderService.user)
        return ok(downloadLink)
    }
}
