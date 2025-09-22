package org.firstapproval.backend.core.domain.archive

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.lingala.zip4j.io.outputstream.ZipOutputStream
import net.lingala.zip4j.model.ZipParameters
import net.lingala.zip4j.model.enums.AesKeyStrength.KEY_STRENGTH_256
import net.lingala.zip4j.model.enums.EncryptionMethod.AES
import org.apache.commons.codec.digest.MessageDigestAlgorithms.SHA_256
import org.apache.commons.lang3.RandomStringUtils.randomPrint
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationStatus.MODERATION
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.StorageType.CLOUD_SECURE_STORAGE
import org.firstapproval.backend.core.domain.publication.StorageType.IPFS
import org.firstapproval.backend.core.domain.publication.file.PublicationFileRepository
import org.firstapproval.backend.core.domain.publication.file.PublicationSampleFileRepository
import org.firstapproval.backend.core.domain.publication.toPublicationElastic
import org.firstapproval.backend.core.external.ipfs.DownloadLink
import org.firstapproval.backend.core.external.ipfs.DownloadLinkRepository
import org.firstapproval.backend.core.external.ipfs.IpfsClient.IpfsContentAvailability.INSTANT
import org.firstapproval.backend.core.external.ipfs.IpfsStorageService
import org.firstapproval.backend.core.external.ipfs.RestoreRequestRepository
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.external.s3.FILES
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.SAMPLE_FILES
import org.firstapproval.backend.core.infra.elastic.PublicationElasticRepository
import org.firstapproval.backend.core.utils.calculateSHA256
import org.springframework.data.domain.PageRequest
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.io.File
import java.io.File.createTempFile
import java.io.FileOutputStream
import java.nio.file.Files
import java.security.DigestOutputStream
import java.security.MessageDigest
import java.time.ZonedDateTime.now
import java.util.Base64
import java.util.UUID
import kotlin.io.path.Path
import kotlin.io.path.exists


private const val BATCH_SIZE = 10
private const val TMP_FOLDER = "archive_tmp"
private const val ARCHIVE_PASSWORD_LENGTH = 32
private const val BUFFER_SIZE = 8192

private const val DESCRIPTIONS_FILE_DEFAULT_NAME = "descriptions"

@Service
class ArchiveService(
    private val publicationRepository: PublicationRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val publicationSampleFileRepository: PublicationSampleFileRepository,
    private val notificationService: NotificationService,
    private val ipfsStorageService: IpfsStorageService,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val restoreRequestRepository: RestoreRequestRepository,
    private val fileStorageService: FileStorageService,
    private val transactionTemplate: TransactionTemplate,
    private val elasticRepository: PublicationElasticRepository,
) {

    val log = logger {}

    @Scheduled(cron = "\${archive-publication-files.cron}")
    @SchedulerLock(name = "ArchiveService.archivePublicationFiles")
    fun archivePublicationFiles() {
        val publications = publicationRepository.findAllByStatusOrderByCreationTime(READY_FOR_PUBLICATION)
        publications.forEach { publication ->
            runCatching {
                log.info { "Publication files for id=${publication.id} started" }
                val publicationFilesIds = mutableListOf<UUID>()
                transactionTemplate.execute { _ ->
                    val password = randomPrint(ARCHIVE_PASSWORD_LENGTH)
                    publicationFilesIds.addAll(archiveProcess(publication, password))
                }
                if (publicationFilesIds.isNotEmpty()) {
                    fileStorageService.deleteByIds(FILES, publicationFilesIds)
                }
            }.onSuccess {
                log.info { "Publication files for id=${publication.id} finished successfully" }
            }.onFailure {
                log.error { "Publication files for id=${publication.id} failed: $it" }
            }
        }
    }

    @Scheduled(cron = "\${ipfs-restore-requests.cron}")
    @SchedulerLock(name = "ArchiveService.restoreContentInIpfs")
    fun restoreContentInIpfs() {
        val restoreRequests = restoreRequestRepository.findAllByCompletionTimeIsNull()
        restoreRequests.forEach { restoreRequest ->
            val contentId = restoreRequest.contentId
            runCatching {
                log.debug { "Restoration request for publication id=${restoreRequest.publicationId} started" }
                val contentInfo = ipfsStorageService.getInfo(contentId)
                if (contentInfo.availability == INSTANT) {
                    val downloadLinkInfo = ipfsStorageService.getDownloadLink(contentId)
                    transactionTemplate.execute {
                        val currentTime = now()
                        val expirationTime = currentTime.plusSeconds(downloadLinkInfo.expiresIn)  //3600 seconds - default value
                        restoreRequest.completionTime = currentTime
                        restoreRequestRepository.save(restoreRequest)
                        downloadLinkRepository.save(DownloadLink(restoreRequest.publicationId, downloadLinkInfo.url, expirationTime))
                        notificationService.sendDatasetIsReadyForDownload(
                            publicationRepository.getReferenceById(restoreRequest.publicationId),
                            restoreRequest.user
                        )
                    }
                }
            }.onSuccess {
                log.debug { "Restoration request for publication id=${restoreRequest.publicationId} sent successfully" }
            }.onFailure {
                log.debug { "Restoration request for publication id=${restoreRequest.publicationId} failed" }
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
        val sampleArchiveResult = archiveSampleFilesProcess(publication)
        val mainArchiveResult = archivePublicationFilesProcess(publication, password)
        publication.status = MODERATION
        publication.archivePassword = password
        publication.archiveSize = mainArchiveResult.size
        publication.archiveSampleSize = sampleArchiveResult?.size
        publication.hash = mainArchiveResult.hash
        publication.filesCount = mainArchiveResult.filesCount.toLong()
        publication.foldersCount = mainArchiveResult.foldersCount.toLong()
        publicationRepository.save(publication)
        notificationService.sendNewPublicationForModeration(publication)
        elasticRepository.save(publication.toPublicationElastic())
        return listOf()
    }

    private fun archivePublicationFilesProcess(publication: Publication, password: String): ArchiveResult {
        val filesIds = mutableListOf<UUID>()
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
        val filesCount = files.totalElements
        var foldersCount = 1
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publication.id, ".zip", folder)
        var err: Exception? = null
        val descriptions = StringBuilder()
        var archiveSize: Long = 0
        var hash: String? = null

        val md = MessageDigest.getInstance(SHA_256)

        try {
            FileOutputStream(tempArchive).use { fos ->
                DigestOutputStream(fos, md).use { digestStream ->
                    ZipOutputStream(digestStream, password.toCharArray()).use { zipOutputStream ->

                        while (!files.isEmpty) {
                            filesIds.addAll(files.map { it.id })
                            files.forEach {
                                if (it.isDir) {
                                    foldersCount++
                                } else {
                                    val inputStream = fileStorageService.get(FILES, it.id.toString())
                                    val zipParams = ZipParameters().apply {
                                        fileNameInZip = it.fullPath
                                        isEncryptFiles = true
                                        encryptionMethod = AES
                                        aesKeyStrength = KEY_STRENGTH_256
                                    }

                                    zipOutputStream.putNextEntry(zipParams)
                                    val buffer = ByteArray(BUFFER_SIZE)
                                    var len: Int
                                    inputStream.use { stream ->
                                        while (stream.read(buffer).also { len = it } > 0) {
                                            zipOutputStream.write(buffer, 0, len)
                                        }
                                    }
                                    zipOutputStream.closeEntry()
                                }

                                if (it.description != null) {
                                    descriptions.append(it.fullPath).append("\n").append(it.description).append("\n\n")
                                }
                            }
                            page = page.next()
                            files = publicationFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)
                        }

                        if (descriptions.isNotEmpty()) {
                            val zipParms = ZipParameters().apply {
                                fileNameInZip = getFileNameForDescriptionsFile(publication.id)
                            }
                            zipOutputStream.putNextEntry(zipParms)
                            descriptions.toString().byteInputStream().use { descStream ->
                                val buffer = ByteArray(BUFFER_SIZE)
                                var len: Int
                                while (descStream.read(buffer).also { len = it } > 0) {
                                    zipOutputStream.write(buffer, 0, len)
                                }
                            }
                            zipOutputStream.closeEntry()
                        }
                    }
                }
            }

            hash = Base64.getEncoder().encodeToString(md.digest())
            archiveSize = tempArchive.length()

            when (publication.storageType) {
                IPFS, CLOUD_SECURE_STORAGE -> saveArchiveToS3(ARCHIVED_PUBLICATION_FILES, publication.id, tempArchive)
                else -> throw IllegalStateException("Storage type must be present")
            }

        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
            tempArchive.delete()
            throw ex
        }

        return ArchiveResult(filesIds, archiveSize, filesCount.toInt(), foldersCount, hash!!)
    }

    private fun archiveSampleFilesProcess(publication: Publication): ArchiveResult? {
        var page = PageRequest.of(0, BATCH_SIZE)
        var files = publicationSampleFileRepository.findByPublicationIdOrderByCreationTimeAsc(publication.id, page)

        if (files.isEmpty) {
            return null
        }

        val filesCount = files.totalElements
        var foldersCount = 1
        val filesIds = mutableListOf<UUID>()
        val folder = getOrCreateTmpFolder()
        val tempArchive = createTempFile(publication.id.toString() + " samples", ".zip", folder)
        val fileOutputStream = FileOutputStream(tempArchive)
        val zipOutputStream = ZipOutputStream(fileOutputStream)
        var err: Exception? = null
        val descriptions = StringBuilder()
        var archiveSize: Long = 0;
        var hash: String? = null
        try {
            while (!files.isEmpty) {
                filesIds.addAll(files.map { it.id })
                files.forEach {
                    if (it.isDir) {
                        foldersCount++
                    }
                    if (!it.isDir) {
                        val inputStream = fileStorageService.get(SAMPLE_FILES, it.id.toString())
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
            if (descriptions.isNotEmpty()) {
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
            }
        } catch (ex: Exception) {
            log.error(ex) { "archive error" }
            err = ex
            throw ex
        } finally {
            zipOutputStream.close()
            fileOutputStream.close()
            if (err == null) {
                hash = calculateSHA256(tempArchive)
                archiveSize = tempArchive.length()
                saveArchiveToS3(ARCHIVED_PUBLICATION_SAMPLE_FILES, publication.id, tempArchive)
            } else {
                tempArchive.delete()
            }
        }
        return ArchiveResult(filesIds, archiveSize, filesCount.toInt(), foldersCount, hash!!)
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

    private fun saveArchiveToIPFS(publication: Publication, tempArchive: File) {
        try {
            val ipfsFileInfo = ipfsStorageService.upload(tempArchive)
            publication.contentId = ipfsFileInfo.id
            publication.status = MODERATION
            publicationRepository.save(publication)
            notificationService.sendNewPublicationForModeration(publication)
        } catch (ex: Exception) {
            log.error(ex) { "ipfs persistence error" }
            throw ex
        } finally {
            tempArchive.delete()
        }
    }

    fun getFileNameForDescriptionsFile(publicationId: String): String {
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

data class ArchiveResult(
    val fileIds: MutableList<UUID>,
    val size: Long,
    val filesCount: Int,
    val foldersCount: Int,
    val hash: String
)
