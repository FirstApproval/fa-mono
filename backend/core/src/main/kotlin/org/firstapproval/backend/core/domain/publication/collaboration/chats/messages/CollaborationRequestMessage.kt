package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.firstapproval.api.server.model.AuthorShortInfo
import org.firstapproval.api.server.model.CollaborationRequestTypeOfWork
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.api.server.model.Workplace
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationRequestMessageFile
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.toApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.AUTHOR_APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.CREATE
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.DONE_WHATS_NEXT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.UPLOAD_FINAL_DRAFT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.COLLABORATION_REQUEST_CREATOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.PUBLICATION_CREATOR
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

    @ManyToOne(fetch = LAZY)
    val collaborationRequest: CollaborationRequest,

    @ManyToOne(fetch = EAGER)
    val user: User,

    @Enumerated(STRING)
    val type: CollaborationRequestMessageType,

    @ElementCollection(fetch = EAGER) // EAGER или LAZY в зависимости от потребностей
    @CollectionTable(
        name = "collaboration_request_messages_recipients", // Имя вспомогательной таблицы в БД
        joinColumns = [JoinColumn(name = "message_id", referencedColumnName = "id")] // Колонка для связи с основной сущностью
    )
    @Column(name = "recipient_type", nullable = false) // Имя колонки для самого ENUM значения в вспомогательной таблице
    @Enumerated(STRING) // Указываем, что ENUM будет храниться как строка
    val recipientTypes: MutableSet<RecipientType>,

    val text: String? = null,

    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb")
    val payload: MessagePayload? = null,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(cascade = [ALL], orphanRemoval = true)
    @JoinColumn(name="message_id", nullable=false, insertable = false, updatable = false)
    val files: List<CollaborationRequestMessageFile> = mutableListOf(),

    val isAssistant: Boolean,

    )

enum class CollaborationRequestMessageType(val sequenceIndex: Int, val recipientType: RecipientType) {
    AGREE_TO_THE_TERMS_OF_COLLABORATION(0, COLLABORATION_REQUEST_CREATOR),
    DATASET_WAS_DOWNLOADED(1, COLLABORATION_REQUEST_CREATOR),
    I_WOULD_LIKE_TO_COLLABORATE(2, COLLABORATION_REQUEST_CREATOR),
    IF_YOU_ARE_INTERESTED_IN_THIS_DATASET(3, COLLABORATION_REQUEST_CREATOR),
    LETS_MAKE_COLLABORATION_REQUEST(4, COLLABORATION_REQUEST_CREATOR),
    FORMALIZED_AGREEMENT(5, COLLABORATION_REQUEST_CREATOR),
    GOT_IT_READY_TO_START(6, COLLABORATION_REQUEST_CREATOR),
    VERIFY_YOUR_NAME_AND_AFFILIATION(7, COLLABORATION_REQUEST_CREATOR),
    I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL(8, COLLABORATION_REQUEST_CREATOR),
    PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE(9, COLLABORATION_REQUEST_CREATOR),
    DONE_WHATS_NEXT(10, COLLABORATION_REQUEST_CREATOR),
    PREFILLED_COLLABORATION_AGREEMENT(11, COLLABORATION_REQUEST_CREATOR),
    EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST(12, COLLABORATION_REQUEST_CREATOR),
    FIRST_STEP_IS_COMPLETED(13, COLLABORATION_REQUEST_CREATOR),
    YOUR_COLLABORATION_IS_ESTABLISHED(14, COLLABORATION_REQUEST_CREATOR),
    IN_TWO_WEEKS_YOU_ARE_PLAN_TO_SHARE_FINAL_DRAFT(15, COLLABORATION_REQUEST_CREATOR),
    AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE(16, COLLABORATION_REQUEST_CREATOR),
    AUTHOR_APPROVED(17, COLLABORATION_REQUEST_CREATOR),
    AUTHOR_DECLINED(17, COLLABORATION_REQUEST_CREATOR),

    CHANGE_MY_PERSONAL_INFO(0, COLLABORATION_REQUEST_CREATOR),
    CHANGE_INFO_ABOUT_MY_PUBLICATION(0, COLLABORATION_REQUEST_CREATOR),

    UPLOAD_FINAL_DRAFT(15, COLLABORATION_REQUEST_CREATOR),
    NOTIFY_CO_AUTHOR(15, COLLABORATION_REQUEST_CREATOR),
    ASC_DATA_AUTHOR(15, COLLABORATION_REQUEST_CREATOR),
    I_NEED_HELP(15, COLLABORATION_REQUEST_CREATOR),

    CREATE(0, PUBLICATION_CREATOR),
    ASSISTANT_CREATE(1, PUBLICATION_CREATOR),
    DEFAULT(2, PUBLICATION_CREATOR),
    COLLABORATION_APPROVED(3, PUBLICATION_CREATOR),
    DATA_USER_ASKED(4, PUBLICATION_CREATOR),
    MANUSCRIPT_APPROVED(5, PUBLICATION_CREATOR),
    DECLINED(6, PUBLICATION_CREATOR),
    AUTHOR_INFO_RECEIVED(7, PUBLICATION_CREATOR),
    PUBLICATION_INFO_RECEIVED(8, PUBLICATION_CREATOR)
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = Create::class, name = "CREATE"),
        JsonSubTypes.Type(value = PersonalDataConfirmation::class, name = "I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL"),
        JsonSubTypes.Type(value = CollaborationPotentialPublicationData::class, name = "DONE_WHATS_NEXT"),
        JsonSubTypes.Type(value = UploadFinalDraftPayload::class, name = "UPLOAD_FINAL_DRAFT"),
        JsonSubTypes.Type(value = AuthorApprovedPayload::class, name = "AUTHOR_APPROVED"),
    ]
)

interface MessagePayload {
    var type: CollaborationRequestMessageType
}

class Create(
    val firstNameLegal: String,
    val lastNameLegal: String,
    val typeOfWork: TypeOfWork,
    val description: String?,
    override var type: CollaborationRequestMessageType = CREATE,
) : MessagePayload

class PersonalDataConfirmation(
    val firstName: String,
    val lastName: String,
    val workplaces: List<Workplace>,
    override var type: CollaborationRequestMessageType = I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
) : MessagePayload

class CollaborationPotentialPublicationData(
    val potentialPublicationTitle: String,
    val typeOfWork: CollaborationRequestTypeOfWork,
    val expectedPublicationDate: String,
    val intendedJournalForPublication: String,
    val detailsOfResearch: String,
    override var type: CollaborationRequestMessageType = DONE_WHATS_NEXT,
) : MessagePayload

class UploadFinalDraftPayload(
    val estimatedSubmissionDate: String,
    val comment: String? = null,
    override var type: CollaborationRequestMessageType = UPLOAD_FINAL_DRAFT,
) : MessagePayload

class AuthorApprovedPayload(
    val approvedAuthor: AuthorShortInfo,
    val expectedApprovingAuthors: List<AuthorShortInfo>,
    override var type: CollaborationRequestMessageType = AUTHOR_APPROVED
) : MessagePayload

fun CollaborationRequestMessage.toApiObject(userService: UserService) = toApiObject(user.toApiObject(userService))

fun CollaborationRequestMessage.toApiObject(userInfo: UserInfo) = CollaborationRequestMessageApiObject(
    CollaborationMessageTypeApiObject.valueOf(type.toString()),
    false
).also {
    it.id = this.id
    it.userInfo = userInfo.takeIf { user.id == userInfo.id }
        ?: throw IllegalArgumentException("UserInfo id ${userInfo.id} doesn't match with user.id ${user.id}")
    it.text = text
    it.payload = payload
    it.isAssistant = isAssistant
    it.sequenceIndex = sequenceIndex
    it.files = files.map { file -> file.toApiObject() }
    it.creationTime = creationTime.toOffsetDateTime()
}
