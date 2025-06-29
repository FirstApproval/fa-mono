package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.LAZY
import java.io.Serializable

@Entity
@Table(name = "message_recipients")
class MessageRecipient(
    @Id
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    val message: CollaborationRequestMessage,

    @Id
    @Enumerated(STRING)
    @Column(name = "recipient_role", nullable = false)
    val recipientType: RecipientType
) : Serializable

enum class RecipientType {
    COLLABORATION_REQUEST_CREATOR,
    PUBLICATION_CREATOR
}
