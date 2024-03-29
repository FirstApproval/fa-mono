package org.firstapproval.backend.core.domain.publication.file

import org.apache.commons.io.FilenameUtils
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.checkAccessToPublication
import org.firstapproval.backend.core.domain.publication.checkPublicationCreator
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.SAMPLE_FILES
import org.firstapproval.backend.core.utils.require
import org.firstapproval.backend.core.utils.sha256HashFromBase64
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionTemplate
import java.io.InputStream
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class PublicationSampleFileService(
    private val publicationSampleFileRepository: PublicationSampleFileRepository,
    private val fileStorageService: FileStorageService,
    private val publicationRepository: PublicationRepository,
    private val transactionalTemplate: TransactionTemplate
) {

    fun getPublicationSampleFiles(user: User?, publicationId: String, dirPath: String): List<PublicationSampleFile> {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkAccessToPublication(user, publication)
        return publicationSampleFileRepository.findAllByPublicationIdAndDirPath(publicationId, dirPath)
    }

    @Transactional
    fun uploadFile(
        user: User,
        publicationId: String,
        fullPath: String,
        isDir: Boolean,
        sha256HashBase64: String?,
        data: InputStream?,
        onCollisionRename: Boolean,
        contentLength: Long?
    ): PublicationSampleFile {
        val filesToDelete = mutableListOf<UUID>()
        var file: PublicationSampleFile? = null
        transactionalTemplate.execute { _ ->
            val fileId = randomUUID()
            val publication = publicationRepository.getReferenceById(publicationId)
            checkPublicationCreator(user, publication)
            val actualFullPath: String
            if (onCollisionRename) {
                actualFullPath = getFileFullPath(publicationId, fullPath)
            } else {
                actualFullPath = fullPath
                dropDuplicate(publicationId, actualFullPath)?.let { filesToDelete.add(it) }
            }
            if (!isDir) {
                fileStorageService.save(SAMPLE_FILES, fileId.toString(), data!!, contentLength!!, sha256HashBase64!!)
            }
            file = publicationSampleFileRepository.save(
                PublicationSampleFile(
                    id = fileId,
                    publication = publication,
                    fullPath = actualFullPath,
                    dirPath = extractDirPath(actualFullPath),
                    isDir = isDir,
                    hash = sha256HashBase64?.let { sha256HashFromBase64(it) },
                    size = contentLength
                )
            )
        }
        if (filesToDelete.isNotEmpty()) {
            fileStorageService.deleteByIds(SAMPLE_FILES, filesToDelete)
        }
        return file.require()
    }

    private fun getFileFullPath(publicationId: String, fullPath: String): String {
        if (!publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            return fullPath
        }
        val fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1)
        val extension = FilenameUtils.getExtension(fileName)
        val fileNameWithoutExtension = fileName.replace(".$extension", "")
        return getFileFullPath(publicationId, fullPath.replace(fileNameWithoutExtension, "${fileNameWithoutExtension}_copy"))
    }

    private fun dropDuplicate(publicationId: String, fullPath: String): UUID? {
        return publicationSampleFileRepository.findByPublicationIdAndFullPath(publicationId, fullPath)?.let {
            publicationSampleFileRepository.delete(it)
            it.id
        }
    }

    @Transactional(readOnly = true)
    fun checkFileNameDuplicates(user: User, publicationId: String, fullPathList: List<String>): Map<String, Boolean> {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkPublicationCreator(user, publication)
        return fullPathList.associateWith { publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, it) }
    }

    fun getDownloadLink(user: User, fileId: UUID): String {
        val file = publicationSampleFileRepository.getReferenceById(fileId)
        checkAccessToPublication(user, file.publication)
        return fileStorageService.generateTemporaryDownloadLink(SAMPLE_FILES, fileId.toString(), file.name)
    }

    @Transactional
    fun deleteFiles(user: User, fileIds: List<UUID>) {
        val filesIdsForDeletion = mutableListOf<UUID>()
        transactionalTemplate.execute { _ ->
            val files = publicationSampleFileRepository.findByIdIn(fileIds)
            val publication = files.first().publication
            if (!files.all { it.publication.id == publication.id }) {
                throw IllegalArgumentException()
            }
            val dirPath = files.first().dirPath
            if (!files.all { it.dirPath == dirPath }) {
                throw IllegalArgumentException()
            }
            checkPublicationCreator(user, publication)
            files.forEach { file ->
                if (file.isDir) {
                    val nestedFiles = publicationSampleFileRepository.getNestedFiles(file.publication.id, file.fullPath)
                    val fileForDeletion = nestedFiles.filter { !it.isDir }
                    publicationSampleFileRepository.deleteAll(nestedFiles)
                    publicationSampleFileRepository.delete(file)
                    filesIdsForDeletion.addAll(fileForDeletion.map { it.id })
                } else {
                    publicationSampleFileRepository.delete(file)
                    filesIdsForDeletion.add(file.id)
                }
            }
        }
        if (filesIdsForDeletion.isNotEmpty()) {
            fileStorageService.deleteByIds(SAMPLE_FILES, filesIdsForDeletion)
        }
    }

    @Transactional
    fun editFile(user: User, fileId: UUID, name: String, description: String?) {
        val file = publicationSampleFileRepository.getReferenceById(fileId)
//        val newFullPath = file.dirPath + name
        checkPublicationCreator(user, file.publication)
//        if (name != file.name) {
//            checkDuplicateNames(newFullPath, file.publication.id)
//        }
//        file.fullPath = newFullPath
        file.description = description
    }

    @Transactional
    fun moveFile(user: User, fileId: UUID, newDirPath: String) {
        val file = publicationSampleFileRepository.getReferenceById(fileId)
        val prevDirPath = file.dirPath
        checkPublicationCreator(user, file.publication)
        checkDirectoryIsExists(newDirPath.dropLast(1), file.publication.id)
        if (file.isDir) {
            checkCollapse(newDirPath, file.fullPath)
            val nestedFiles = publicationSampleFileRepository.getNestedFiles(file.publication.id, file.fullPath)
            nestedFiles.add(file)
            nestedFiles.forEach {
                val newFullPath = it.fullPath.replaceFirst(prevDirPath, newDirPath)
                checkDuplicateNames(newFullPath, file.publication.id)
                it.fullPath = newFullPath
                it.dirPath = it.dirPath.replaceFirst(prevDirPath, newDirPath)
            }
        } else {
            val newFullPath = file.fullPath.replaceFirst(prevDirPath, newDirPath)
            checkDuplicateNames(newFullPath, file.publication.id)
            file.fullPath = newFullPath
            file.dirPath = file.dirPath.replaceFirst(file.dirPath, newDirPath)
        }
    }

    @Transactional
    fun createFolder(user: User, publicationId: String, parentDirPath: String, name: String, description: String?): PublicationSampleFile {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkDirectoryIsExists(parentDirPath.dropLast(1), publicationId)
        checkPublicationCreator(user, publication)
        val fullPath = "$parentDirPath$name"
        checkDuplicateNames(fullPath, publicationId)
        val file = PublicationSampleFile(
            id = randomUUID(),
            publication = publication,
            fullPath = "$parentDirPath$name",
            dirPath = parentDirPath,
            description = description,
            isDir = true
        )
        publicationSampleFileRepository.save(file)
        return file
    }

    private fun extractDirPath(fullPath: String) = fullPath.substring(0, fullPath.lastIndexOf('/') + 1)

    private fun checkDirectoryIsExists(fullPath: String, publicationId: String) {
        if (fullPath != "" && !publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkCollapse(newLocation: String, currentLocation: String) {
        if (newLocation.startsWith(currentLocation)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkDuplicateNames(fullPath: String, publicationId: String) {
        if (publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }
}
