package org.firstapproval.backend.core.domain.publication

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface PublicationRepository : JpaRepository<Publication, UUID> {
    fun findAllByStatusOrderByCreationTimeDesc(publicationStatus: PublicationStatus): List<Publication>

    fun findAllByStatus(publicationStatus: PublicationStatus, page: Pageable): Page<Publication>
}
