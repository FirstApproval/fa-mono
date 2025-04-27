package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType
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
    val payload: MessagePayload? = null,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(mappedBy = "message", cascade = [CascadeType.ALL], orphanRemoval = true)
    val files: List<CollaborationRequestFile> = mutableListOf()
)

enum class MessageType(ordinal: Int) {
    CREATE(1),
    ACCEPT_OR_REJECT_COLLABORATION_REQUEST(2)
//    START,
//    SECOND_STAGE_ACCEPT,
//    SECOND_STAGE_DECLINE,
//    FINAL
}

@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = Create::class, name = "CREATE")
    ]
)
interface MessagePayload

class Create(
    val firstNameLegal: String,
    val lastNameLegal: String,
    val typeOfWork: TypeOfWork,
    val description: String
) : MessagePayload

fun CollaborationRequestMessage.toApiObject(userService: UserService) = toApiObject(user.toApiObject(userService))

fun CollaborationRequestMessage.toApiObject(userInfo: UserInfo) = CollaborationRequestMessageApiObject(
    this.id,
    userInfo.takeIf { this.user.id === userInfo.id } ?: throw IllegalArgumentException("UserInfo id doesn't match with user.id"),
    CollaborationMessageTypeApiObject.valueOf(type.toString()),
    text,
    payload,
    creationTime.toOffsetDateTime()
)
