package org.firstapproval.backend.core.domain.publication.collaboration.requests.authors

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationRequestInvitedAuthorRepository : JpaRepository<CollaborationRequestInvitedAuthor, UUID> {
    fun findByCollaborationRequestPublicationIdAndAuthorUserId(
        collaborationRequestPublicationId: String,
        authorUserId: UUID,
        page: Pageable
    ): Page<CollaborationRequestInvitedAuthor>
}
