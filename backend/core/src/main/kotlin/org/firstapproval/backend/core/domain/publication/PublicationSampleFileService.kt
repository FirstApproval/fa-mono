package org.firstapproval.backend.core.domain.publication

import org.apache.commons.io.FilenameUtils
import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.SAMPLE_FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.user.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class PublicationSampleFileService(
    private val publicationSampleFileRepository: PublicationSampleFileRepository,
    private val fileStorageService: FileStorageService,
    private val publicationRepository: PublicationRepository
) {

    fun getPublicationSampleFiles(publicationId: UUID, dirPath: String): List<PublicationSampleFile> {
        return publicationSampleFileRepository.findAllByPublicationIdAndDirPath(publicationId, dirPath)
    }

    @Transactional
    fun uploadFile(user: User, publicationId: UUID, fullPath: String, isDir: Boolean, data: InputStream?, onCollisionRename: Boolean, contentLength: Long?): PublicationSampleFile {
        val fileId = randomUUID()
        val publication = publicationRepository.getReferenceById(publicationId)
        checkAccessToPublication(user, publication)
        val actualFullPath: String
        if (onCollisionRename) {
            actualFullPath = getFileFullPath(publicationId, fullPath)
        } else {
            actualFullPath = fullPath
            dropDuplicate(publicationId, actualFullPath)
        }
        val hash = if (!isDir) {
            fileStorageService.save(SAMPLE_FILES, fileId.toString(), data!!, contentLength!!).eTag
        } else null
        val file = publicationSampleFileRepository.save(
            PublicationSampleFile(
                id = fileId,
                publication = publication,
                fullPath = actualFullPath,
                dirPath = extractDirPath(actualFullPath),
                isDir = isDir,
                hash = hash
            )
        )
        return file
    }

    private fun getFileFullPath(publicationId: UUID, fullPath: String): String {
        if (!publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            return fullPath
        }
        val fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1)
        val extension = FilenameUtils.getExtension(fileName)
        val fileNameWithoutExtension = fileName.replace(".$extension", "")
        return getFileFullPath(publicationId, fullPath.replace(fileNameWithoutExtension, "${fileNameWithoutExtension}_copy"))
    }

    private fun dropDuplicate(publicationId: UUID, fullPath: String) {
        val publicationFile = publicationSampleFileRepository.findByPublicationIdAndFullPath(publicationId, fullPath)
        if (publicationFile != null) {
            fileStorageService.delete(FILES, publicationFile.id)
        }
    }

    @Transactional(readOnly = true)
    fun checkFileNameDuplicates(user: User, publicationId: UUID, fullPathList: List<String>): Map<String, Boolean> {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkAccessToPublication(user, publication)
        return fullPathList.associateWith { publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, it) }
    }

    @Transactional(readOnly = true)
    fun getPublicationSampleFileWithContent(fileId: UUID): FileResponse {
        val file = publicationSampleFileRepository.getReferenceById(fileId)
        return FileResponse(
            name = file.name,
            s3Object = fileStorageService.get(SAMPLE_FILES, fileId.toString())
        )
    }

    @Transactional
    fun deleteFiles(user: User, fileIds: List<UUID>) {
        val files = publicationSampleFileRepository.findByIdIn(fileIds)
        val publication = files.first().publication
        if (!files.all { it.publication.id == publication.id }) {
            throw IllegalArgumentException()
        }
        val dirPath = files.first().dirPath
        if (!files.all { it.dirPath == dirPath }) {
            throw IllegalArgumentException()
        }
        checkAccessToPublication(user, publication)
        files.forEach { file ->
            if (file.isDir) {
                val nestedFiles = publicationSampleFileRepository.getNestedFiles(file.publication.id, file.fullPath)
                val fileForDeletion = nestedFiles.filter { !it.isDir }
                publicationSampleFileRepository.deleteAll(nestedFiles)
                publicationSampleFileRepository.delete(file)
                if (fileForDeletion.isNotEmpty()) {
                    fileStorageService.deleteByIds(SAMPLE_FILES, fileForDeletion.map { it.id })
                }
            } else {
                publicationSampleFileRepository.delete(file)
                fileStorageService.delete(SAMPLE_FILES, file.id)
            }
        }
    }

    @Transactional
    fun editFile(user: User, fileId: UUID, name: String, description: String?) {
        val file = publicationSampleFileRepository.getReferenceById(fileId)
//        val newFullPath = file.dirPath + name
        checkAccessToPublication(user, file.publication)
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
        checkAccessToPublication(user, file.publication)
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
    fun createFolder(user: User, publicationId: UUID, parentDirPath: String, name: String, description: String?): PublicationSampleFile {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkDirectoryIsExists(parentDirPath.dropLast(1), publicationId)
        checkAccessToPublication(user, publication)
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

    private fun checkDirectoryIsExists(fullPath: String, publicationId: UUID) {
        if (fullPath != "" && !publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkCollapse(newLocation: String, currentLocation: String) {
        if (newLocation.startsWith(currentLocation)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkDuplicateNames(fullPath: String, publicationId: UUID) {
        if (publicationSampleFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }
}
