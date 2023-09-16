package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.firstapproval.api.server.model.CheckFileDuplicatesRequest
import org.firstapproval.api.server.model.CreateFolderRequest
import org.firstapproval.api.server.model.DeleteByIdsRequest
import org.firstapproval.api.server.model.EditFileRequest
import org.firstapproval.api.server.model.MoveFileRequest
import org.firstapproval.api.server.model.PublicationFile
import org.firstapproval.api.server.model.UploadType
import org.firstapproval.api.server.model.UploadType.RENAME
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.config.security.userOrNull
import org.firstapproval.backend.core.domain.publication.PublicationFileService
import org.springframework.http.HttpStatus.OK
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
class PublicationFileController(
    private val publicationFileService: PublicationFileService,
    private val authHolderService: AuthHolderService
) : FileApi {

    override fun getPublicationFiles(publicationId: UUID, dirPath: String): ResponseEntity<List<PublicationFile>> {
        val files = publicationFileService.getPublicationFiles(authHolderService.userOrNull(), publicationId, dirPath)
        return ok(files.map {
            PublicationFile()
                .id(it.id)
                .publicationId(it.publication.id)
                .creationTime(it.creationTime.toOffsetDateTime())
                .description(it.description)
                .dirPath(it.dirPath)
                .size(it.size)
                .fullPath(it.fullPath)
                .isDir(it.isDir)
                .hash(it.hash)
        })
    }

    override fun checkFileDuplicates(
        publicationId: UUID,
        checkFileDuplicatesRequest: CheckFileDuplicatesRequest
    ): ResponseEntity<MutableMap<String, Boolean>> {
        return ok(
            publicationFileService.checkFileNameDuplicates(
                authHolderService.user,
                publicationId,
                checkFileDuplicatesRequest.fullPathList
            ).toMutableMap()
        )
    }

    override fun uploadFile(
        publicationId: UUID,
        fullPath: String,
        isDir: Boolean,
        type: UploadType,
        sha256HashBase64: String,
        contentLength: Long?,
        file: MultipartFile?
    ): ResponseEntity<PublicationFile> {
        val fileTmp =
            publicationFileService.uploadFile(
                authHolderService.user,
                publicationId,
                fullPath,
                isDir,
                sha256HashBase64,
                file?.inputStream,
                type == RENAME,
                contentLength
            )
        return ResponseEntity(
            PublicationFile().id(fileTmp.id)
                .publicationId(fileTmp.publication.id)
                .creationTime(fileTmp.creationTime.toOffsetDateTime())
                .dirPath(fileTmp.dirPath)
                .fullPath(fileTmp.fullPath)
                .isDir(fileTmp.isDir)
                .size(fileTmp.size)
                .hash(fileTmp.hash), OK
        )
    }

    override fun getDownloadLinkForPublicationFile(fileId: UUID): ResponseEntity<String> {
        return ok(publicationFileService.getDownloadLink(authHolderService.user, fileId))
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
        val file = publicationFileService.createFolder(
            authHolderService.user,
            publicationId,
            createFolderRequest.dirPath,
            createFolderRequest.name,
            createFolderRequest.description
        )
        return ResponseEntity(
            PublicationFile().id(file.id)
                .publicationId(file.publication.id)
                .creationTime(file.creationTime.toOffsetDateTime())
                .dirPath(file.dirPath)
                .fullPath(file.fullPath)
                .size(file.size)
                .isDir(file.isDir), OK
        )
    }
}
