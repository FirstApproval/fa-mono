package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.file.FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream
import java.util.*
import java.util.UUID.*

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
                dirPath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1),
                isDir = isDir
            )
        )
        if (!isDir) {
            fileStorageService.save(FILES, fileId.toString(), data!!)
        }
        return file
    }

    @Transactional
    fun deleteFile(user: User, fileId: UUID) {
        val file = publicationFileRepository.getReferenceById(fileId)
        checkAccessToPublication(user, file.publication)
        if (file.isDir) {
            val nestedFiles = publicationFileRepository.getNestedFiles(file.publication.id, file.fullPath)
            val fileForDeletion = nestedFiles.filter { !it.isDir }
            publicationFileRepository.deleteAll(nestedFiles)
            fileStorageService.deleteByIds(FILES, fileForDeletion.map { it.id.toString() })
        } else {
            publicationFileRepository.delete(file)
            fileStorageService.delete(FILES, file.id.toString())
        }
    }

    @Transactional
    fun renameFile(user: User, fileId: UUID, newName: String) {
        val file = publicationFileRepository.getReferenceById(fileId)
        val newFullPath = file.dirPath + newName
        checkAccessToPublication(user, file.publication)
        checkDuplicateNames(newFullPath, file.publication.id)
        file.fullPath = newFullPath
    }

    @Transactional
    fun moveFile(user: User, fileId: UUID, newLocation: String) {
        val file = publicationFileRepository.getReferenceById(fileId)
        val prevDirPath = file.dirPath
        checkAccessToPublication(user, file.publication)
        checkDirectoryIsExists(newLocation, file.publication.id)
        if (file.isDir) {
            checkCollapse(newLocation, file.fullPath)
            val nestedFiles = publicationFileRepository.getNestedFiles(file.publication.id, file.fullPath)
            nestedFiles.forEach {
                val newFullPath = it.fullPath.replaceFirst(prevDirPath, "$newLocation/")
                checkDuplicateNames(newFullPath, file.publication.id)
                it.fullPath = newFullPath
                it.dirPath = it.dirPath.replaceFirst(prevDirPath, "$newLocation/")
            }
        } else {
            val newFullPath = file.fullPath.replaceFirst(file.dirPath, "$newLocation/")
            checkDuplicateNames(newFullPath, file.publication.id)
            file.fullPath = newFullPath
            file.dirPath = file.dirPath.replaceFirst(file.dirPath, "$newLocation/")
        }
    }

    @Transactional
    fun createFolder(user: User, publicationId: UUID, parentDirPath: String, name: String) {
        val parentDir = publicationFileRepository.findByPublicationIdAndFullPathAndIsDirTrue(publicationId, parentDirPath)
        checkAccessToPublication(user, parentDir.publication)
        publicationFileRepository.save(
            PublicationFile(
                id = randomUUID(),
                publication = parentDir.publication,
                fullPath = "$parentDirPath/$name",
                dirPath = "$parentDirPath/",
                isDir = true
            )
        )
    }

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

    private fun checkAccessToPublication(user: User, publication: Publication) {
        if (user.id != publication.user.id) {
            throw AccessDeniedException("Access denied")
        }
    }

    private fun checkDuplicateNames(fullPath: String, publicationId: UUID) {
        if (publicationFileRepository.existsByPublicationIdAndFullPath(publicationId, fullPath)) {
            throw IllegalArgumentException()
        }
    }
}
