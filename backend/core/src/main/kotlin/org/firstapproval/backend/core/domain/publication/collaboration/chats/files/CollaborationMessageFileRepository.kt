package org.firstapproval.backend.core.domain.publication.collaboration.chats.files

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationMessageFileRepository : JpaRepository<CollaborationRequestMessageFile, UUID>
