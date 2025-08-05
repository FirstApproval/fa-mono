package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.LAZY
import java.io.Serializable

@Entity
@Table(name = "collaboration_request_messages_recipients")
class MessageRecipient(
    @Id
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    val message: CollaborationRequestMessage,

    @Id
    @Enumerated(STRING)
    @Column(name = "recipient_type", nullable = false)
    val recipientType: RecipientType
) : Serializable

enum class RecipientType {
    DATA_USER,
    DATA_AUTHOR
}
