package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.firstapproval.backend.core.domain.publication.PublicationFileService
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException.BadRequest
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.UUID

val tempFolder = createTempFolder()

fun createTempFolder(): File {
    val tempFolder = File.createTempFile("temp", "")
    tempFolder.delete()
    tempFolder.mkdir()
    return tempFolder
}

@RestController
class PublicationFileController(
    val publicationFileService: PublicationFileService
) : FileApi {
    override fun uploadFile(publicationId: UUID, fullPath: String, isDir: Boolean, body: Resource?): ResponseEntity<Void> {
        publicationFileService.uploadFile(publicationId, fullPath, isDir)
        val name = fullPath.substring(fullPath.lastIndexOf('/') + 1)
        if (!isDir) {
            if (body != null) {
                saveFileToTempFolder(body.inputStream, tempFolder, name)
            } else {
                return ResponseEntity(HttpStatus.BAD_REQUEST)
            }
        }

        return ResponseEntity(HttpStatus.OK)
    }

    private fun saveFileToTempFolder(inputStream: InputStream, folder: File, fileName: String) {
        val file = File(folder, fileName)
        val outputStream = FileOutputStream(file)
        inputStream.use { input ->
            outputStream.use { output ->
                input.copyTo(output)
            }
        }
        println("File saved to: ${file.absolutePath}")
    }
}
