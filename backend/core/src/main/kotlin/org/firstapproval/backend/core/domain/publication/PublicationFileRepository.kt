package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.*


private const val SEARCH_NESTED_FILES_QUERY = """
    SELECT * FROM publication_files WHERE publication_id = :publicationId AND full_path LIKE :path%
"""

interface PublicationFileRepository : JpaRepository<PublicationFile, UUID> {

    @Query(value = SEARCH_NESTED_FILES_QUERY, nativeQuery = true)
    fun getNestedFiles(publicationId: UUID, path: String): List<PublicationFile>

    fun existsByPublicationIdAndFullPath(publicationId: UUID, fullPath: String): Boolean

    fun findAllByPublicationIdAndDirPath(publicationId: UUID, dirPath: String): List<PublicationFile>

    fun findByIdIn(ids: List<UUID>): List<PublicationFile>

    fun findByPublicationIdOrderByCreationTimeAsc(publicationId: UUID, pageable: Pageable): Page<PublicationFile>
}