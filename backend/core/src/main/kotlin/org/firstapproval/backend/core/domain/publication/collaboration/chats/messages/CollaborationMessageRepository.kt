package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationMessageRepository : JpaRepository<CollaborationRequestMessage, UUID> {
    fun findAllByCollaborationRequestIdOrderByCreationTime(collaborationRequestId: UUID): List<CollaborationRequestMessage>
}
