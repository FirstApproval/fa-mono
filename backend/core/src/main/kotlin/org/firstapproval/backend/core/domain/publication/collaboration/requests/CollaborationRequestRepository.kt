package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationRequestRepository : JpaRepository<CollaborationRequest, UUID> {
//    fun existsByUserIdAndPublicationIdAndStatus(userId: UUID, publicationId: String, status: CollaborationRequestStatus): Boolean
    fun findByUserIdAndPublicationId(userId: UUID, publicationId: String): CollaborationRequest?
    fun findByPublicationId(publicationId: String, page: Pageable): Page<CollaborationRequest>
}
