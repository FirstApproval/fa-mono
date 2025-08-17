package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.formatters

import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType
import org.springframework.stereotype.Component
import java.lang.IllegalArgumentException

@Component
class MessageEmailFormatStrategyFactory(strategies: List<MessageEmailFormatStrategy>) {
    private val strategyMap: Map<CollaborationRequestMessageType, MessageEmailFormatStrategy> =
        strategies.associateBy { it.type }

    fun generateSubject(message: CollaborationRequestMessage): String =
        strategyMap[message.type]?.generateSubject(message) ?: throw IllegalArgumentException(
            "The message type '${message.type}' does not provide for sending notifications"
        )

    fun generateContent(message: CollaborationRequestMessage): String =
        strategyMap[message.type]?.generateContent(message) ?: throw IllegalArgumentException(
            "The message type '${message.type}' does not provide for sending notifications"
        )
}

@Component
class YourCollaborationIsEstablished : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.YOUR_COLLABORATION_IS_ESTABLISHED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Great news! Your collaboration is established. Author has signed the Collaboration Agreement on publication: " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        "Your collaboration is established. You may check details in collaboration chat."
}

@Component
class YourCollaborationIsDeclined : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.YOUR_COLLABORATION_IS_DECLINED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Unfortunately, author has decided not to continue the collaboration on publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        """
           According to the Collaboration Agreement, termination of the agreement
           means that {mappedDecisionAuthor} will not be included as a co-author in the publication.
        """.trimIndent()
}

@Component
class AllDataAuthorsRespondedToCollaborationRequest : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] All data authors have responded to your collaboration request on publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        """
            Now you have collaborators for working with the dataset" +
            The final stage of collaboration is reviewing and approving the final draft of your manuscript together with your collaborators.
            You can do this by using the "Upload Final Draft" function —
            this will send the manuscript to your collaborators for review and approval before submission.
        """
}

@Component
class AllDataAuthorsDeclinedToCollaborationRequest : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Unfortunately, all data authors have declined your request for collaboration on publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        """
         Unfortunately, all data authors have declined your request for collaboration.
         As no collaboration agreement has been signed, you may still use the dataset
         in your work under the terms of its license, applying the Standard Citation.
        """.trimIndent()
}

@Component
class AuthorApproved : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.AUTHOR_APPROVED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] has confirmed the text of the drafted manuscript for collaboration request on publication" +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        "Author has confirmed the text of the drafted manuscript with following comments:"
}

@Component
class AuthorDeclined : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.AUTHOR_DECLINED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "Unfortunately, author has decided not to continue the collaboration"
    override fun generateContent(message: CollaborationRequestMessage) =
        """Unfortunately, author has decided not to continue the collaboration.
           According to the Collaboration Agreement, termination of the agreement
           means that author will not be included as a co-author in the publication.
        """.trimMargin()
}

@Component
class AllAuthorsConfirmed : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.ALL_AUTHORS_CONFIRMED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] All authors confirmed your collaboration request on publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        """Congratulations! All Data Authors have confirmed the text of the drafted manuscript.
           Now you can submit the manuscript to the publisher.
           You may use this log to continue discussions with Data Authors according your collaboration.
        """.trimIndent()
}

@Component
class AllAuthorsDeclined : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.ALL_AUTHORS_DECLINED // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Unfortunately, all data authors have declined your request for collaboration on publication " +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        """Unfortunately, all data authors have declined your request for collaboration.
           As no collaboration agreement has been signed, you may still use the dataset
           in your work under the terms of its license, applying the Standard Citation.
        """.trimIndent()
}

@Component
class IWouldLikeToIncludeYou : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] The data user would like to include you as a co-author." +
            "'${message.collaborationRequest.publication.title}'"
    override fun generateContent(message: CollaborationRequestMessage) =
        "I would like to include you as a co-author of my work, as I plan to use the materials from your dataset."
}

@Component
class AssistantFinalDraftAttachedByDataUser : MessageEmailFormatStrategy {
    override val type = CollaborationRequestMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER // заглушка
    override fun generateSubject(message: CollaborationRequestMessage) =
        "[FirstApproval] Data user attached a preview of the manuscript of their publication"
    override fun generateContent(message: CollaborationRequestMessage) =
        """UPD: ${message.collaborationRequest.user.firstName} ${message.collaborationRequest.user.lastName} attached a preview of the manuscript of their publication.
           You will have 2 weeks to read the article and decide whether to accept or decline co-authorship.
           You can ask questions or provide your suggestions to the author via private messages.
           We recommend starting this process well in advance.
           If you do not approve the request within 2 weeks, you will lose the opportunity for co-authorship in this article.
           If you decline, the data user will simply cite your dataset.""".trimIndent()
}
