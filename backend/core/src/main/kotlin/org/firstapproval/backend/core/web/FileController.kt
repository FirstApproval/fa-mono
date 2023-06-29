package org.firstapproval.backend.core.web

import org.firstapproval.api.server.FileApi
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

val tempFolder = createTempFolder()

fun createTempFolder(): File {
    val tempFolder = File.createTempFile("temp", "")
    tempFolder.delete()
    tempFolder.mkdir()
    return tempFolder
}

@RestController
class FileController(
) : FileApi {
    override fun uploadFile(body: Resource): ResponseEntity<Void> {
        saveFileToTempFolder(body.inputStream, tempFolder, "test")
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
