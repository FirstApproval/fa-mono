package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.firstapproval.api.server.model.CreateFolderRequest
import org.firstapproval.api.server.model.MoveFileRequest
import org.firstapproval.api.server.model.PublicationFile
import org.firstapproval.api.server.model.RenameFileRequest
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
                .dirPath(it.dirPath)
                .fullPath(it.fullPath)
                .isDir(it.isDir)
        })
    }

    override fun uploadFile(publicationId: UUID, fullPath: String, isDir: Boolean, body: Resource?): ResponseEntity<Void> {
        publicationFileService.uploadFile(authHolderService.user, publicationId, fullPath, isDir, body?.inputStream)
        return ResponseEntity(OK)
    }

    override fun deleteFile(id: UUID): ResponseEntity<Void> {
        publicationFileService.deleteFile(authHolderService.user, id)
        return ResponseEntity(OK)
    }

    override fun moveFile(id: UUID, moveFileRequest: MoveFileRequest): ResponseEntity<Void> {
        publicationFileService.moveFile(authHolderService.user, id, moveFileRequest.newLocation)
        return ResponseEntity(OK)
    }

    override fun renameFile(id: UUID, renameFileRequest: RenameFileRequest): ResponseEntity<Void> {
        publicationFileService.renameFile(authHolderService.user, id, renameFileRequest.newName)
        return ResponseEntity(OK)
    }

    override fun createFolder(publicationId: UUID, createFolderRequest: CreateFolderRequest): ResponseEntity<Void> {
        publicationFileService.createFolder(authHolderService.user, publicationId, createFolderRequest.parentPath, createFolderRequest.name)
        return ResponseEntity(OK)
    }
}
