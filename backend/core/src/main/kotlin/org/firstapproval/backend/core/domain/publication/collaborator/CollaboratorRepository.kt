package org.firstapproval.backend.core.domain.publication.collaborator

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CollaboratorRepository : JpaRepository<Collaborator, UUID> {
    fun findAllByPublicationId(publicationId: String, page: Pageable): Page<Collaborator>
}
