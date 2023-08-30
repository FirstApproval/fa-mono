package org.firstapproval.backend.core.domain.archive

import co.elastic.clients.elasticsearch._types.aggregations.AdjacencyMatrixBucket
import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.lingala.zip4j.io.outputstream.ZipOutputStream
import net.lingala.zip4j.model.ZipParameters
import net.lingala.zip4j.model.enums.EncryptionMethod.ZIP_STANDARD
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.file.SAMPLE_FILES
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationFileRepository
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationSampleFileRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.toPublicationElastic
import org.firstapproval.backend.core.elastic.PublicationElasticRepository
import org.springframework.data.domain.PageRequest
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.io.File
import java.io.File.createTempFile
import java.io.FileOutputStream
import java.io.InputStream
import java.lang.StringBuilder
import java.nio.file.Files
import java.time.ZonedDateTime.now
import java.util.UUID
import kotlin.io.path.Path
import kotlin.io.path.exists


private const val BATCH_SIZE = 10
private const val TMP_FOLDER = "archive_tmp"

private const val DESCRIPTIONS_FILE_DEFAULT_NAME = "descriptions"

@Service
class ArchiveService(
    private val publicationRepository: PublicationRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val publicationSampleFileRepository: PublicationSampleFileRepository,
    private val notificationService: NotificationService,
    private val ipfsClient: IpfsClient,
    private val fileStorageService: FileStorageService,
    private val transactionTemplate: TransactionTemplate,
    private val elasticRepository: PublicationElasticRepository
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
                    val password = (100000000..999999999).random().toString()
                    val publicationFilesIds = archiveProcess(publication, password)
                    if (publicationFilesIds.isNotEmpty()) {
                        fileStorageService.deleteByIds(FILES, publicationFilesIds)
                    }
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

    private fun archiveProcess(publication: Publication, password: String): List<UUID> {
        archiveSampleFilesProcess(publication)
        val filesIds = archivePublicationFilesProcess(publication, password)
        publication.status = PUBLISHED
        publication.publicationTime = now()
        publication.archivePassword = password
        publicationRepository.save(publication)
        elasticRepository.save(publication.toPublicationElastic())
        return filesIds
    }

    private fun archivePublicationFilesProcess(publication: Publication, password: String): MutableList<UUID> {
        val filesIds = mutableListOf<UUID>()
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publication.id.toString(), ".zip", folder)
        val fileOutputStream = FileOutputStream(tempArchive)
        val zipOutputStream = ZipOutputStream(fileOutputStream, password.toCharArray())
        var err: Exception? = null
        val descriptions = StringBuilder()
        // TODO rebuild for try with resources
        try {
            while (!files.isEmpty) {
                filesIds.addAll(files.map { it.id })
                files.forEach {
                    if (!it.isDir) {
                        val inputStream = fileStorageService.get(FILES, it.id.toString()).objectContent
                        val zipParms = ZipParameters()
                        zipParms.fileNameInZip = it.fullPath
                        zipParms.isEncryptFiles = true
                        zipParms.encryptionMethod = ZIP_STANDARD
                        zipOutputStream.putNextEntry(zipParms)
                        val buffer = ByteArray(1024)
                        var len: Int

                        while (inputStream.read(buffer).also { len = it } > 0) {
                            zipOutputStream.write(buffer, 0, len)
                        }
                        inputStream.close()
                        zipOutputStream.closeEntry()
                    }
                    if (it.description != null) {
                        descriptions.append(it.fullPath + "\n" + it.description + "\n\n")
                    }
                }
                page = page.next()
                files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
            }
            val zipParms = ZipParameters()
            zipParms.fileNameInZip = getFileNameForDescriptionsFile(publication.id)
            zipOutputStream.putNextEntry(zipParms)
            val buffer = ByteArray(1024)
            var len: Int
            descriptions.toString().byteInputStream().use {
                while (it.read(buffer).also { len = it } > 0) {
                    zipOutputStream.write(buffer, 0, len)
                }
                zipOutputStream.closeEntry()
            }
        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
            err = ex
            throw ex
        } finally {
            zipOutputStream.close()
            fileOutputStream.close()
            if (err == null) {
                saveArchiveToS3(ARCHIVED_PUBLICATION_FILES, publication.id.toString(), tempArchive)
            } else {
                tempArchive.delete()
            }
        }
        return filesIds
    }

    private fun archiveSampleFilesProcess(publication: Publication) {
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationSampleFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
        val filesIds = mutableListOf<UUID>()
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publication.id.toString() + " samples", ".zip", folder)
        val fileOutputStream = FileOutputStream(tempArchive)
        val zipOutputStream = ZipOutputStream(fileOutputStream)
        var err: Exception? = null
        val descriptions = StringBuilder()
        try {
            while (!files.isEmpty) {
                filesIds.addAll(files.map { it.id })
                files.forEach {
                    if (!it.isDir) {
                        val inputStream = fileStorageService.get(SAMPLE_FILES, it.id.toString()).objectContent
                        val zipParms = ZipParameters()
                        zipParms.fileNameInZip = it.fullPath
                        zipOutputStream.putNextEntry(zipParms)
                        val buffer = ByteArray(1024)
                        var len: Int

                        while (inputStream.read(buffer).also { len = it } > 0) {
                            zipOutputStream.write(buffer, 0, len)
                        }
                        inputStream.close()
                        zipOutputStream.closeEntry()
                    }
                    if (it.description != null) {
                        descriptions.append(it.fullPath + "\n" + it.description + "\n\n")
                    }
                }
                page = page.next()
                files = publicationSampleFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
            }
            val zipParms = ZipParameters()
            zipParms.fileNameInZip = getFileNameForDescriptionsFile(publication.id)
            zipOutputStream.putNextEntry(zipParms)
            val buffer = ByteArray(1024)
            var len: Int
            descriptions.toString().byteInputStream().use {
                while (it.read(buffer).also { len = it } > 0) {
                    zipOutputStream.write(buffer, 0, len)
                }
                zipOutputStream.closeEntry()
            }
        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
            err = ex
            throw ex
        } finally {
            zipOutputStream.close()
            fileOutputStream.close()
            if (err == null) {
                saveArchiveToS3(ARCHIVED_PUBLICATION_SAMPLE_FILES, publication.id.toString(), tempArchive)
            } else {
                tempArchive.delete()
            }
        }
    }

    private fun saveArchiveToS3(bucket: String, id: String, file: File) {
        try {
            file.inputStream().use { fileStorageService.save(bucket, id, it, file.length()) }
        } catch (ex: Exception) {
            log.error(ex) { "s3 persistence error" }
            throw ex
        } finally {
            file.delete()
        }
    }

    fun getFileNameForDescriptionsFile(publicationId: UUID): String {
        var fileName = DESCRIPTIONS_FILE_DEFAULT_NAME
        while (publicationFileRepository.existsByPublicationIdAndFullPath(publicationId, "/$fileName.txt")) {
            fileName += "_1"
        }
        return "$fileName.txt"
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
