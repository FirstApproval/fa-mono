package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface PublicationRepository : JpaRepository<Publication, UUID> {
    fun findAllByStatusOrderByCreationTimeDesc(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByIdIn(ids: List<UUID>): List<Publication>

    fun findAllByStatusAndCreatorId(publicationStatus: PublicationStatus, creatorId: UUID, page: Pageable): Page<Publication>

    fun findAllByAccessTypeAndIsFeatured(accessType: AccessType, isFeatured: Boolean, page: Pageable): Page<Publication>

    fun findAllByStatusAndAccessType(status: PublicationStatus, accessType: AccessType, page: Pageable): Page<Publication>
}
