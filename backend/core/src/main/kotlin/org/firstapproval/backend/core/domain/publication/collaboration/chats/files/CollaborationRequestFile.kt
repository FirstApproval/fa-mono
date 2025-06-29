package org.firstapproval.backend.core.domain.publication.collaboration.chats.files

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_request_message_files")
class CollaborationRequestFile(
    @Id
    val id: UUID = randomUUID(),

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "message_id", nullable = false)
    val message: CollaborationRequestMessage,

    val fileId: String
)
