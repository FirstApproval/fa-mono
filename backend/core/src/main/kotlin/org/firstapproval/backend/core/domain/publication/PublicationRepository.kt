package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface PublicationRepository : JpaRepository<Publication, String> {
    fun findAllByStatusOrderByCreationTimeDesc(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByIdInAndStatus(ids: List<String>, publicationStatus: PublicationStatus): List<Publication>

    fun findAllByStatusAndAccessTypeAndCreatorId(
        publicationStatus: PublicationStatus,
        accessType: AccessType,
        creatorId: UUID,
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
