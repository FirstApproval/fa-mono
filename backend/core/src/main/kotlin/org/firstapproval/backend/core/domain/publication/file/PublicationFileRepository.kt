package org.firstapproval.backend.core.domain.publication.file

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID


private const val SEARCH_NESTED_FILES_QUERY = """
    SELECT * FROM publication_files WHERE publication_id = :publicationId AND full_path LIKE CONCAT(:path, '/%')
"""

private const val FIND_IDS_QUERY = """
    SELECT id FROM publication_files WHERE publication_id = :publicationId
"""

interface PublicationFileRepository : JpaRepository<PublicationFile, UUID> {

    @Query(value = SEARCH_NESTED_FILES_QUERY, nativeQuery = true)
    fun getNestedFiles(publicationId: String, path: String): MutableList<PublicationFile>

    fun existsByPublicationIdAndFullPath(publicationId: String, fullPath: String): Boolean

    fun findByPublicationIdAndFullPath(publicationId: String, fullPath: String): PublicationFile?

    fun findAllByPublicationIdAndDirPath(publicationId: String, dirPath: String): List<PublicationFile>

    @Query("select sum(pf.size) from PublicationFile pf where pf.publication.id = :publicationId and pf.isDir = false")
    fun getPublicationFilesSize(publicationId: String): Long

    fun findByIdIn(ids: List<UUID>): List<PublicationFile>

    fun findByPublicationIdOrderByCreationTimeAsc(publicationId: String, pageable: Pageable): Page<PublicationFile>

    @Query(value = FIND_IDS_QUERY, nativeQuery = true)
    fun findIdsByPublicationId(publicationId: String): List<UUID>
}
