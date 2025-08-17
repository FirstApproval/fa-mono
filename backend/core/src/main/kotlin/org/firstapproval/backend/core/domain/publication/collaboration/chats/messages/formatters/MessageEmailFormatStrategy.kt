package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.formatters

import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType

interface MessageEmailFormatStrategy {
    val type: CollaborationRequestMessageType
    fun generateSubject(message: CollaborationRequestMessage): String
    fun generateContent(message: CollaborationRequestMessage): String
}
