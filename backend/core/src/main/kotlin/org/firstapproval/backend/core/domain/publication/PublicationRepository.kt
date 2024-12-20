package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface PublicationRepository : JpaRepository<Publication, String> {
    fun findAllByStatusOrderByCreationTime(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByIdInAndStatusAndIsBlockedIsFalseAndAccessType(
        ids: List<String>,
        publicationStatus: PublicationStatus,
        accessType: AccessType
    ): List<Publication>

    fun findAllByStatusInAndCreatorIdAndIsBlockedIsFalse(
        publicationStatuses: Collection<PublicationStatus>,
        creatorId: UUID,
        page: Pageable
    ): Page<Publication>

    @Query(
        "select p from Publication p join p.authors a where a.isConfirmed = true and a.user.id = :userId " +
            "and p.status in :publicationStatuses and p.isBlocked = false and p.accessType = 'OPEN'"
    )
    fun findAllByConfirmedAuthorUsernameAndIsBlockedIsFalse(
        publicationStatuses: Collection<PublicationStatus>,
        userId: UUID,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessTypeAndIsFeaturedAndIsBlockedIsFalse(
        status: PublicationStatus,
        accessType: AccessType,
        isFeatured: Boolean,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessTypeAndIsBlockedIsFalse(
        status: PublicationStatus,
        accessType: AccessType,
        page: Pageable
    ): Page<Publication>

    fun findByIdAndIsBlockedIsFalse(id: String): Publication
}
