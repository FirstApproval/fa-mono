package org.firstapproval.backend.core.domain.publication

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*


private const val SEARCH_NESTED_SAMPLE_FILES_QUERY = """
    SELECT * FROM publication_sample_files WHERE publication_id = :publicationId AND full_path LIKE :path%
"""

interface PublicationSampleFileRepository : JpaRepository<PublicationSampleFile, UUID> {

    @Query(value = SEARCH_NESTED_SAMPLE_FILES_QUERY, nativeQuery = true)
    fun getNestedFiles(publicationId: UUID, path: String): List<PublicationSampleFile>

    fun existsByPublicationIdAndFullPath(publicationId: UUID, fullPath: String): Boolean

    fun findByPublicationIdAndFullPath(publicationId: UUID, fullPath: String): PublicationSampleFile?

    fun findAllByPublicationIdAndDirPath(publicationId: UUID, dirPath: String): List<PublicationSampleFile>

    fun findByIdIn(ids: List<UUID>): List<PublicationSampleFile>
}
