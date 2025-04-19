package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.collaboration.chats.CollaborationRequestChat
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationRequestFile
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_request_messages")
class CollaborationRequestMessage(
    @Id
    val id: UUID = randomUUID(),

    @ManyToOne(fetch = EAGER)
    val chat: CollaborationRequestChat,

    @ManyToOne(fetch = EAGER)
    val user: User,

    val type: MessageType,

    val text: String? = null,

    @Type(JsonBinaryType::class)
    val payload: Map<String, Any>,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(mappedBy = "message", cascade = [CascadeType.ALL], orphanRemoval = true)
    val files: List<CollaborationRequestFile> = mutableListOf()
)

enum class MessageType {
    START,
    SECOND_STAGE_ACCEPT,
    SECOND_STAGE_DECLINE,
    FINAL
}
