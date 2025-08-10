package org.firstapproval.backend.core.domain.publication.downloader

import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface DownloaderRepository : JpaRepository<Downloader, UUID> {

    fun getByUserAndPublication(user: User, publication: Publication): Downloader?

    fun findAllByPublicationId(publicationId: String, pageable: Pageable): Page<Downloader>

    @Query("""
    SELECT d
    FROM Downloader d
    WHERE d.user.id = :userId AND 
        d.user.id NOT IN (
        SELECT pa.user.id
        FROM Author pa
        WHERE pa.publication.id = d.publication.id
          AND pa.user.id IS NOT NULL
    )
    """)
    fun findAllByUserIdExcludeAuthors(
        @Param("userId") userId: UUID,
        pageable: Pageable
    ): Page<Downloader>
    fun existsByUserIdAndPublication(userId: UUID, publication: Publication): Boolean
}
