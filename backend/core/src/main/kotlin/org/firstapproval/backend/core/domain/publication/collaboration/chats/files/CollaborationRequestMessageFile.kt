package org.firstapproval.backend.core.domain.publication.collaboration.chats.files

import jakarta.persistence.*
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationRequestMessageFile as CollaborationRequestMessageFileApiObject

@Entity
@Table(name = "collaboration_request_message_files")
class CollaborationRequestMessageFile(
    @Id
    val id: UUID = randomUUID(),
    val fileId: UUID,
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "message_id", insertable = false, updatable = false)
    val message: CollaborationRequestMessage? = null,
    val name: String,
    val size: Long,
    val creationTime: ZonedDateTime = now()
)

fun CollaborationRequestMessageFile.toApiObject() = CollaborationRequestMessageFileApiObject(
    id,
    name,
    size
)
