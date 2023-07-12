package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.user.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class PublicationFileService(
    private val publicationFileRepository: PublicationFileRepository,
    private val fileStorageService: FileStorageService,
    private val publicationRepository: PublicationRepository
) {

    fun getPublicationFiles(user: User, publicationId: UUID, dirPath: String): List<PublicationFile> {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkAccessToPublication(user, publication)
        return publicationFileRepository.findAllByPublicationIdAndDirPath(publicationId, dirPath)
    }

    @Transactional
    fun uploadFile(user: User, publicationId: UUID, fullPath: String, isDir: Boolean, data: InputStream?): PublicationFile {
        val fileId = randomUUID()
        val publication = publicationRepository.getReferenceById(publicationId)
        checkAccessToPublication(user, publication)
        checkDuplicateNames(fullPath, publicationId)
        val file = publicationFileRepository.save(
            PublicationFile(
                id = fileId,
                publication = publication,
                fullPath = fullPath,
                dirPath = extractDirPath(fullPath),
                isDir = isDir
            )
        )
        if (!isDir) {
            fileStorageService.save(FILES, fileId.toString(), data!!)
        }
        return file
    }

    @Transactional
    fun deleteFiles(user: User, fileIds: List<UUID>) {
        val files = publicationFileRepository.findByIdIn(fileIds)
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
                val nestedFiles = publicationFileRepository.getNestedFiles(file.publication.id, file.fullPath)
                val fileForDeletion = nestedFiles.filter { !it.isDir }
                publicationFileRepository.deleteAll(nestedFiles)
                if (fileForDeletion.isNotEmpty()) {
                    fileStorageService.deleteByIds(FILES, fileForDeletion.map { it.id })
                }
            } else {
                publicationFileRepository.delete(file)
                fileStorageService.delete(FILES, file.id)
            }
        }
    }

    @Transactional
    fun editFile(user: User, fileId: UUID, name: String, description: String?) {
        val file = publicationFileRepository.getReferenceById(fileId)
        val newFullPath = file.dirPath + name
        checkAccessToPublication(user, file.publication)
        if (name != file.name) {
            checkDuplicateNames(newFullPath, file.publication.id)
        }
        file.fullPath = newFullPath
        file.description = description
    }

    @Transactional
    fun moveFile(user: User, fileId: UUID, newDirPath: String) {
        val file = publicationFileRepository.getReferenceById(fileId)
        val prevDirPath = file.dirPath
        checkAccessToPublication(user, file.publication)
        checkDirectoryIsExists(newDirPath.dropLast(1), file.publication.id)
        if (file.isDir) {
            checkCollapse(newDirPath, file.fullPath)
            val nestedFiles = publicationFileRepository.getNestedFiles(file.publication.id, file.fullPath)
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
    fun createFolder(user: User, publicationId: UUID, parentDirPath: String, name: String, description: String?): PublicationFile {
        val publication = publicationRepository.getReferenceById(publicationId)
        checkDirectoryIsExists(parentDirPath.dropLast(1), publicationId)
        checkAccessToPublication(user, publication)
        val fullPath = "$parentDirPath$name"
        checkDuplicateNames(fullPath, publicationId)
        val file = PublicationFile(
            id = randomUUID(),
            publication = publication,
            fullPath = "$parentDirPath$name",
            dirPath = parentDirPath,
            description = description,
            isDir = true
        )
        publicationFileRepository.save(file)
        return file
    }

    private fun extractDirPath(fullPath: String) = fullPath.substring(0, fullPath.lastIndexOf('/') + 1)

    private fun checkDirectoryIsExists(fullPath: String, publicationId: UUID) {
        if (fullPath != "" && !publicationFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkCollapse(newLocation: String, currentLocation: String) {
        if (newLocation.startsWith(currentLocation)) {
            throw IllegalArgumentException()
        }
    }

    private fun checkDuplicateNames(fullPath: String, publicationId: UUID) {
        if (publicationFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }
}
