package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.formatters

import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType
import org.springframework.stereotype.Component

@Component
class MessageEmailFormatStrategyFactory(strategies: List<MessageEmailFormatStrategy>) {
    private val strategyMap: Map<CollaborationRequestMessageType, MessageEmailFormatStrategy> =
        strategies.associateBy { it.type }

    fun get(type: CollaborationRequestMessageType): MessageEmailFormatStrategy =
        strategyMap[type] ?: DefaultMessageTextStrategy()

    fun generateSubject(message: CollaborationRequestMessage): String =
        (strategyMap[message.type] ?: DefaultMessageTextStrategy()).generateSubject(message)

    fun generateContent(message: CollaborationRequestMessage): String =
        (strategyMap[message.type] ?: DefaultMessageTextStrategy()).generateContent(message)
}

class DefaultMessageTextStrategy : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.DEFAULT // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Received new message about collaboration request for publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        "${message.user.fullName} отправил(а) сообщение (${message.type})"
}
