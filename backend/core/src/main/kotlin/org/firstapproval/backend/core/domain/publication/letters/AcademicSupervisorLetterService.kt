package org.firstapproval.backend.core.domain.publication.letters

import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.checkPublicationCreator
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.external.s3.ACADEMIC_SUPERVISOR_LETTERS
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class AcademicSupervisorLetterService(
    private val repository: AcademicSupervisorLetterRepository,
    private val fileStorageService: FileStorageService,
    private val publicationService: PublicationService
) {
    @Transactional
    fun upload(
        publicationId: String,
        academicSupervisorName: String,
        user: User,
        file: MultipartFile
    ): AcademicSupervisorLetter {
        val publication = publicationService.getAndCheckPublicationCreator(publicationId, user)
        val letterId = randomUUID()

        val letter = repository.save(
            AcademicSupervisorLetter(
                id = letterId,
                fileName = file.originalFilename!!,
                academicSupervisorName = academicSupervisorName,
                contentLength = file.size,
                publication = publication
            )
        )

        fileStorageService.save(ACADEMIC_SUPERVISOR_LETTERS, letterId.toString(), file.inputStream)

        return letter
    }

    fun get(publicationId: String, user: User): List<AcademicSupervisorLetter> {
        // publicationService.get(user, publicationId) not only loads the publication,
        // but also ensures that the given user is its creator (access control check)
        val publication = publicationService.getAndCheckPublicationCreator(publicationId, user)
        return repository.findAllByPublication(publication)
    }

    @Transactional
    fun delete(id: UUID, publicationId: String, user: User) {
        // publicationService.get(user, publicationId) not only loads the publication,
        // but also ensures that the given user is its creator (access control check)
        publicationService.getAndCheckPublicationCreator(publicationId, user)
        repository.deleteByIdAndPublicationId(id, publicationId)
    }

    fun getDownloadLink(id: UUID, publicationId: String, user: User): String {
        // publicationService.get(user, publicationId) not only loads the publication,
        // but also ensures that the given user is its creator (access control check)
        val letter = repository.getReferenceById(id)
        checkPublicationCreator(user, letter.publication)
        return fileStorageService.generateTemporaryDownloadLink(ACADEMIC_SUPERVISOR_LETTERS, id.toString(), letter.fileName)
    }
}
