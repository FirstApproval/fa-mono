package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationFileService
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus.OK
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class PublicationFileController(
    private val publicationFileService: PublicationFileService,
    private val authHolderService: AuthHolderService
) : FileApi {

    override fun getPublicationFiles(publicationId: UUID, dirPath: String): ResponseEntity<List<PublicationFile>> {
        val files = publicationFileService.getPublicationFiles(authHolderService.user, publicationId, dirPath)
        return ok(files.map {
            PublicationFile()
                .id(it.id)
                .publicationId(it.publication.id)
                .creationTime(it.creationTime.toOffsetDateTime())
                .description(it.description)
                .dirPath(it.dirPath)
                .fullPath(it.fullPath)
                .isDir(it.isDir)
        })
    }

    override fun uploadFile(publicationId: UUID, fullPath: String, isDir: Boolean, body: Resource?): ResponseEntity<PublicationFile> {
        val file = publicationFileService.uploadFile(authHolderService.user, publicationId, fullPath, isDir, body?.inputStream)
        return ResponseEntity(PublicationFile().id(file.id)
            .publicationId(file.publication.id)
            .creationTime(file.creationTime.toOffsetDateTime())
            .dirPath(file.dirPath)
            .fullPath(file.fullPath)
            .isDir(file.isDir), OK)
    }

    override fun deleteFiles(deleteByIdsRequest: DeleteByIdsRequest): ResponseEntity<Void> {
        publicationFileService.deleteFiles(authHolderService.user, deleteByIdsRequest.ids.toList())
        return ok().build()
    }

    override fun moveFile(id: UUID, moveFileRequest: MoveFileRequest): ResponseEntity<Void> {
        publicationFileService.moveFile(authHolderService.user, id, moveFileRequest.newDirPath)
        return ok().build()
    }

    override fun editFile(id: UUID, editFileRequest: EditFileRequest): ResponseEntity<Void> {
        publicationFileService.editFile(authHolderService.user, id, editFileRequest.name, editFileRequest.description)
        return ok().build()
    }

    override fun createFolder(publicationId: UUID, createFolderRequest: CreateFolderRequest): ResponseEntity<PublicationFile> {
        val file = publicationFileService.createFolder(authHolderService.user, publicationId, createFolderRequest.dirPath, createFolderRequest.name, createFolderRequest.description)
        return ResponseEntity(PublicationFile().id(file.id)
            .publicationId(file.publication.id)
            .creationTime(file.creationTime.toOffsetDateTime())
            .dirPath(file.dirPath)
            .fullPath(file.fullPath)
            .isDir(file.isDir), OK)
    }
}
