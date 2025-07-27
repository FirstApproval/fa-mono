package org.firstapproval.backend.core.domain.publication.collaboration.chats.files

import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationRequestMessageFile as CollaborationRequestMessageFileApiObject

@Entity
@Table(name = "collaboration_request_message_files")
class CollaborationRequestMessageFile(
    @Id
    val id: UUID = randomUUID(),
    val fileId: UUID,
    @ManyToOne(fetch = EAGER)
    val message: CollaborationRequestMessage,
    val name: String,
    val size: Long,
    val creationTime: ZonedDateTime = now()
)

fun CollaborationRequestMessageFile.toApiObject() = CollaborationRequestMessageFileApiObject(
    id,
    name,
    size
)
