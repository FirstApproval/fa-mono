package org.firstapproval.backend.core.domain.publication.collaboration.chats

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_request_chats")
class CollaborationRequestChat(
    @Id
    val id: UUID = randomUUID(),

    @OneToOne
    val collaborationRequest: CollaborationRequest,

    val isFinished: Boolean = false,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(mappedBy = "chat", cascade = [CascadeType.ALL], orphanRemoval = true)
    val messages: List<CollaborationRequestMessage> = mutableListOf()
)
