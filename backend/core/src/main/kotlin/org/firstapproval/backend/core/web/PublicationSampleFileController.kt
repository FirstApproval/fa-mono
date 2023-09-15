package org.firstapproval.backend.core.web

import org.firstapproval.api.server.SampleFileApi
import org.firstapproval.api.server.model.CheckFileDuplicatesRequest
import org.firstapproval.api.server.model.CreateFolderRequest
import org.firstapproval.api.server.model.DeleteByIdsRequest
import org.firstapproval.api.server.model.EditFileRequest
import org.firstapproval.api.server.model.MoveFileRequest
import org.firstapproval.api.server.model.PublicationFile
import org.firstapproval.api.server.model.UploadType
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationSampleFileService
import org.springframework.http.HttpStatus.OK
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
class PublicationSampleFileController(
    private val publicationSampleFileService: PublicationSampleFileService,
    private val authHolderService: AuthHolderService
) : SampleFileApi {

    override fun getPublicationSampleFiles(publicationId: UUID, dirPath: String): ResponseEntity<List<PublicationFile>> {
        val files = publicationSampleFileService.getPublicationSampleFiles(publicationId, dirPath)
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

    override fun checkSampleFileDuplicates(
        publicationId: UUID,
        checkFileDuplicatesRequest: CheckFileDuplicatesRequest
    ): ResponseEntity<MutableMap<String, Boolean>> {
        return ok(
            publicationSampleFileService.checkFileNameDuplicates(
                authHolderService.user,
                publicationId,
                checkFileDuplicatesRequest.fullPathList
            ).toMutableMap()
        )
    }

    override fun uploadSampleFile(
        publicationId: UUID,
        fullPath: String,
        isDir: Boolean,
        type: UploadType,
        contentLength: Long?,
        file: MultipartFile?
    ): ResponseEntity<PublicationFile> {
        val fileTmp = publicationSampleFileService.uploadFile(
            authHolderService.user,
            publicationId,
            fullPath,
            isDir,
            file?.inputStream,
            type == UploadType.RENAME,
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

    override fun getPublicationSampleFileDownloadLink(fileId: UUID): ResponseEntity<String> {
        val link = publicationSampleFileService.getDownloadLink(authHolderService.user, fileId)
        return ok().body(link)
    }

    override fun deleteSampleFiles(deleteByIdsRequest: DeleteByIdsRequest): ResponseEntity<Void> {
        publicationSampleFileService.deleteFiles(authHolderService.user, deleteByIdsRequest.ids.toList())
        return ok().build()
    }

    override fun moveSampleFile(id: UUID, moveFileRequest: MoveFileRequest): ResponseEntity<Void> {
        publicationSampleFileService.moveFile(authHolderService.user, id, moveFileRequest.newDirPath)
        return ok().build()
    }

    override fun editSampleFile(id: UUID, editFileRequest: EditFileRequest): ResponseEntity<Void> {
        publicationSampleFileService.editFile(authHolderService.user, id, editFileRequest.name, editFileRequest.description)
        return ok().build()
    }

    override fun createFolderForSampleFile(publicationId: UUID, createFolderRequest: CreateFolderRequest): ResponseEntity<PublicationFile> {
        val file = publicationSampleFileService.createFolder(
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
