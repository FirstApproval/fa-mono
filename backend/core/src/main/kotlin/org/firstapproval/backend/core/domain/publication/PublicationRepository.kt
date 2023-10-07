package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface PublicationRepository : JpaRepository<Publication, String> {
    fun findAllByStatusOrderByCreationTime(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByIdInAndStatus(ids: List<String>, publicationStatus: PublicationStatus): List<Publication>

    fun findAllByStatusInAndAccessTypeAndCreatorId(
        publicationStatuses: Collection<PublicationStatus>,
        accessType: AccessType,
        creatorId: UUID,
        page: Pageable
    ): Page<Publication>

    @Query("select p from Publication p join p.authors a where a.isConfirmed = true and a.user.id = :userId and p.status in :publicationStatuses")
    fun findAllByConfirmedAuthorUsername(
        publicationStatuses: Collection<PublicationStatus>,
        userId: UUID,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessTypeAndIsFeatured(
        status: PublicationStatus,
        accessType: AccessType,
        isFeatured: Boolean,
        page: Pageable
    ): Page<Publication>

    fun findAllByStatusAndAccessType(status: PublicationStatus, accessType: AccessType, page: Pageable): Page<Publication>
}
