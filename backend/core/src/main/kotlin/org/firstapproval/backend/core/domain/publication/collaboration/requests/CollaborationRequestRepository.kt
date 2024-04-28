package org.firstapproval.backend.core.domain.publication.collaboration.requests

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationRequestRepository : JpaRepository<CollaborationRequest, UUID> {
    fun findByUserIdAndPublicationId(userId: UUID, publicationId: String): CollaborationRequest?
    fun findByPublicationIdAndStatusIn(
        publicationId: String,
        collaborationRequestStatuses: Collection<CollaborationRequestStatus>,
        page: Pageable
    ): Page<CollaborationRequest>
}
