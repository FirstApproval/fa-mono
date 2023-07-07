package org.firstapproval.backend.core.domain.archive

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.publication.PublicationFileRepository
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLICATION_IN_PROGRESS
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.File
import java.io.File.createTempFile
import java.io.FileOutputStream
import java.nio.file.Files
import java.util.*
import java.util.zip.*
import kotlin.io.path.Path
import kotlin.io.path.exists

private const val BATCH_SIZE = 10
private const val TMP_FOLDER = "archive_tmp"

@Service
class ArchiveService(
    private val publicationRepository: PublicationRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val fileStorageService: FileStorageService
) {

    val log = logger {}

    fun refreshTmpFolder() {
        val folder = File(TMP_FOLDER)
        if (folder.exists()) {
            folder.listFiles()?.forEach { it.delete() }
        }
    }

    @Transactional
    fun archivePublicationFiles(publicationId: UUID) {
        val publication = publicationRepository.getReferenceById(publicationId)
        publication.status = PUBLICATION_IN_PROGRESS
        publicationRepository.saveAllAndFlush(listOf(publication))
        archiveProcess(publicationId)
        publication.status = PUBLISHED
        publicationRepository.saveAllAndFlush(listOf(publication))
    }

    private fun archiveProcess(publicationId: UUID) {
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publicationId, page)
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publicationId.toString(), ".zip", folder)
        val fileOutputStream = FileOutputStream(tempArchive)
        val zipOutputStream = ZipOutputStream(fileOutputStream)
        try {
            while (!files.isEmpty) {
                files.forEach {
                    if (!it.isDir) {
                        val inputStream = fileStorageService.get(FILES, it.id.toString())
                        val zipEntry = ZipEntry(it.fullPath)
                        zipOutputStream.putNextEntry(zipEntry)
                        val buffer = ByteArray(1024)
                        var len: Int

                        while (inputStream.read(buffer).also { len = it } > 0) {
                            zipOutputStream.write(buffer, 0, len)
                        }
                        inputStream.close()
                        zipOutputStream.closeEntry()
                    }
                }
                page = page.next()
                files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publicationId, page)
            }
        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
        } finally {
            zipOutputStream.close()
            fileOutputStream.close()
            // TODO TO IPFS
            tempArchive.delete()
        }
    }

    private fun getOrCreateTmpFolder(): File {
        val folderPath = Path(TMP_FOLDER)
        return if (folderPath.exists()) {
            folderPath.toFile()
        } else {
            Files.createDirectory(folderPath).toFile()
        }
    }
}