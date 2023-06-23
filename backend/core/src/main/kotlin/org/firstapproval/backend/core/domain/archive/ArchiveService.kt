package org.firstapproval.backend.core.domain.archive

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationFileRepository
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.springframework.data.domain.PageRequest
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.io.File
import java.io.File.createTempFile
import java.io.FileOutputStream
import java.nio.file.Files
import java.time.ZonedDateTime.now
import java.util.*
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.Path
import kotlin.io.path.exists

private const val BATCH_SIZE = 10
private const val TMP_FOLDER = "archive_tmp"

@Service
class ArchiveService(
    private val publicationRepository: PublicationRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val ipfsClient: IpfsClient,
    private val fileStorageService: FileStorageService,
    private val transactionTemplate: TransactionTemplate
) {

    val log = logger {}

    @Scheduled(cron = "\${archive-publication-files-to-ipfs.cron}")
    @SchedulerLock(name = "ArchiveService.archivePublicationFiles")
    fun archivePublicationFiles() {
        val publications = publicationRepository.findAllByStatusOrderByCreationTimeDesc(READY_FOR_PUBLICATION)
        publications.forEach { publication ->
            runCatching {
                log.debug { "Publication files for id=${publication.id} started" }
                transactionTemplate.execute { _ ->
                    val publicationFilesIds = archiveProcess(publication)
                    fileStorageService.deleteByIds(FILES, publicationFilesIds)
                }
            }.onSuccess {
                log.debug { "Publication files for id=${publication.id} finished successfully" }
            }.onFailure {
                log.error { "Publication files for id=${publication.id} failed: $it" }
            }
        }
    }

    fun refreshTmpFolder() {
        val folder = File(TMP_FOLDER)
        if (folder.exists()) {
            folder.listFiles()?.forEach { it.delete() }
        }
    }

    private fun archiveProcess(publication: Publication): List<UUID> {
        val filesIds = mutableListOf<UUID>()
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publication.id.toString(), ".zip", folder)
        val fileOutputStream = FileOutputStream(tempArchive)
        val zipOutputStream = ZipOutputStream(fileOutputStream)
        try {
            while (!files.isEmpty) {
                filesIds.addAll(files.map { it.id })
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
                files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
            }
        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
        } finally {
            zipOutputStream.close()
            fileOutputStream.close()
            if (filesIds.isNotEmpty()) {
                uploadToIpfs(publication, tempArchive)
            }
            tempArchive.delete()
        }

        return filesIds
    }

    private fun uploadToIpfs(publication: Publication, tempArchive: File) {
        val ipfsFileInfo = ipfsClient.upload(tempArchive)
        publication.contentId = ipfsFileInfo.id
        publication.status = PUBLISHED
        publication.publicationTime = now()
        publicationRepository.save(publication)
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
