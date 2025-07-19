package org.firstapproval.backend.core.domain.publication.collaboration.chats.files

import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import java.util.UUID

@Entity
@Table(name = "collaboration_request_message_files")
class CollaborationRequestMessageFile(
    @Id
    val id: UUID,
    @ManyToOne(fetch = EAGER)
    val message: CollaborationRequestMessage,
)
