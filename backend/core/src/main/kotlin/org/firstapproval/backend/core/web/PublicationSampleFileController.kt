package org.firstapproval.backend.core.web

import org.firstapproval.api.server.SampleFileApi
import org.firstapproval.api.server.model.CreateFolderRequest
import org.firstapproval.api.server.model.DeleteByIdsRequest
import org.firstapproval.api.server.model.EditFileRequest
import org.firstapproval.api.server.model.MoveFileRequest
import org.firstapproval.api.server.model.PublicationFile
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationSampleFileService
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus.OK
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.net.URLConnection.guessContentTypeFromName
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
                .fullPath(it.fullPath)
                .isDir(it.isDir)
        })
    }

    override fun uploadSampleFile(publicationId: UUID, fullPath: String, isDir: Boolean, body: Resource?): ResponseEntity<PublicationFile> {
        val file = publicationSampleFileService.uploadFile(authHolderService.user, publicationId, fullPath, isDir, body?.inputStream)
        return ResponseEntity(PublicationFile().id(file.id)
            .publicationId(file.publication.id)
            .creationTime(file.creationTime.toOffsetDateTime())
            .dirPath(file.dirPath)
            .fullPath(file.fullPath)
            .isDir(file.isDir), OK)
    }

    override fun downloadPublicationSampleFile(fileId: UUID): ResponseEntity<Resource> {
        val file = publicationSampleFileService.getPublicationSampleFileWithContent(fileId)
        val contentType: MediaType = try {
            MediaType.parseMediaType(guessContentTypeFromName(file.name))
        } catch (ex: Exception) {
            MediaType.APPLICATION_OCTET_STREAM
        }
        return ok()
            .contentType(contentType)
            .header("Content-disposition", "attachment; filename=\"${file.name}\"")
            .contentLength(file.s3Object.objectMetadata.contentLength)
            .body(InputStreamResource(file.s3Object.objectContent))
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
        val file = publicationSampleFileService.createFolder(authHolderService.user, publicationId, createFolderRequest.dirPath, createFolderRequest.name, createFolderRequest.description)
        return ResponseEntity(PublicationFile().id(file.id)
            .publicationId(file.publication.id)
            .creationTime(file.creationTime.toOffsetDateTime())
            .dirPath(file.dirPath)
            .fullPath(file.fullPath)
            .isDir(file.isDir), OK)
    }
}
