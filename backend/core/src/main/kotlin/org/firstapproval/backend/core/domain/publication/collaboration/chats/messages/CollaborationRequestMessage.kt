package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationRequestFile
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.MessageType.ASSISTANT_CREATE
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.MessageType.CREATE
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.publication.collaboration.requests.TypeOfWork
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationMessageType as CollaborationMessageTypeApiObject
import org.firstapproval.api.server.model.CollaborationRequestMessage as CollaborationRequestMessageApiObject

@Entity
@Table(name = "collaboration_request_messages")
class CollaborationRequestMessage(
    @Id
    val id: UUID = randomUUID(),

    @ManyToOne(fetch = EAGER)
    val collaborationRequest: CollaborationRequest,

    @ManyToOne(fetch = EAGER)
    val user: User,

    @Enumerated(STRING)
    val type: MessageType,

    val text: String? = null,

    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb")
    val payload: MessagePayload? = null,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(mappedBy = "message", cascade = [CascadeType.ALL], orphanRemoval = true)
    val files: List<CollaborationRequestFile> = mutableListOf()
)

enum class MessageType(ordinal: Int) {
    AGREE_TO_THE_TERMS_OF_COLLABORATION(0),
    CREATE(1),
    ASSISTANT_CREATE(1),
    DEFAULT(2),
    COLLABORATION_APPROVED(3),
    DATA_USER_ASKED(4),
    MANUSCRIPT_APPROVED(5),
    DECLINED(6),
    AUTHOR_INFO_RECEIVED(7),
    PUBLICATION_INFO_RECEIVED(8)
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = Create::class, name = "CREATE"),
        JsonSubTypes.Type(value = AssistantCreate::class, name = "ASSISTANT_CREATE"),
        JsonSubTypes.Type(value = Create::class, name = "DEFAULT"),
        JsonSubTypes.Type(value = Create::class, name = "COLLABORATION_APPROVED"),
        JsonSubTypes.Type(value = Create::class, name = "DATA_USER_ASKED"),
        JsonSubTypes.Type(value = Create::class, name = "MANUSCRIPT_APPROVED"),
        JsonSubTypes.Type(value = Create::class, name = "DECLINED"),
        JsonSubTypes.Type(value = Create::class, name = "AUTHOR_INFO_RECEIVED"),
        JsonSubTypes.Type(value = Create::class, name = "PUBLICATION_INFO_RECEIVED"),
    ]
)
interface MessagePayload {
    var type: MessageType
}

class Create(
    val firstNameLegal: String,
    val lastNameLegal: String,
    val typeOfWork: TypeOfWork,
    val description: String?,
    override var type: MessageType = CREATE,
) : MessagePayload

class AssistantCreate(
    override var type: MessageType = ASSISTANT_CREATE,
) : MessagePayload

fun CollaborationRequestMessage.toApiObject(userService: UserService) = toApiObject(user.toApiObject(userService))

fun CollaborationRequestMessage.toApiObject(userInfo: UserInfo) = CollaborationRequestMessageApiObject(
    CollaborationMessageTypeApiObject.valueOf(type.toString()),
    text,
    false
).also {
    it.id = this.id
    it.userInfo = userInfo.takeIf { this.user.id === userInfo.id }
        ?: throw IllegalArgumentException("UserInfo id doesn't match with user.id")
    it.payload = payload
    it.creationTime = creationTime.toOffsetDateTime()
}
