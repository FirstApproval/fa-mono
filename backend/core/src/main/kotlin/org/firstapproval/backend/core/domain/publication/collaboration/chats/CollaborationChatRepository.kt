package org.firstapproval.backend.core.domain.publication.collaboration.chats

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationChatRepository : JpaRepository<CollaborationRequestChat, UUID>
