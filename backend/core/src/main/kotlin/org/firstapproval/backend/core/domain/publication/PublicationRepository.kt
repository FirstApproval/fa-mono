package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

private const val FIND_AUTHOR_PUBLICATIONS_QUERY = """
    SELECT p.* FROM publications p
    LEFT JOIN publication_confirmed_authors pca ON p.id = pca.publication_id
    WHERE pca.user_id = :creatorId AND p.status = :publicationStatus AND p.access_type = :accessType
    ORDER BY p.creation_time DESC 
"""

private const val FIND_ALL_PUBLISHED_PUBLICATIONS_QUERY = """
    SELECT DISTINCT p.* FROM publications p
    LEFT JOIN publication_confirmed_authors pca ON p.id = pca.publication_id
    WHERE (p.creator_id = :authorId AND p.status = 'PUBLISHED' AND p.access_type = 'OPEN')
    OR (pca.user_id != p.creator_id AND p.status = 'PUBLISHED' AND p.access_type = 'OPEN')
    ORDER BY p.creation_time DESC
"""

interface PublicationRepository : JpaRepository<Publication, String> {
    fun findAllByStatusOrderByCreationTimeDesc(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByIdInAndStatus(ids: List<String>, publicationStatus: PublicationStatus): List<Publication>

    fun findAllByStatusAndAccessTypeAndCreatorId(
        publicationStatus: PublicationStatus,
        accessType: AccessType,
        creatorId: UUID,
        page: Pageable
    ): Page<Publication>

    @Query(FIND_ALL_PUBLISHED_PUBLICATIONS_QUERY, nativeQuery = true)
    fun findAllPublishedPublicationsByAuthorId(
        authorId: UUID,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessTypeAndIsFeatured(
        status: PublicationStatus,
        accessType: AccessType,
        isFeatured: Boolean,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessType(status: PublicationStatus, accessType: AccessType, page: Pageable): Page<Publication>

    @Query(FIND_AUTHOR_PUBLICATIONS_QUERY, nativeQuery = true)
    fun findAllAuthorPublications(
        publicationStatus: String,
        accessType: String,
        creatorId: UUID,
        page: Pageable
    ): Page<Publication>
}
