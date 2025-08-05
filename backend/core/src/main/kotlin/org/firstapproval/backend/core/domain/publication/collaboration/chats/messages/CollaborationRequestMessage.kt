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
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.APPROVE_MANUSCRIPT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.AUTHOR_APPROVED
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.DONE_WHATS_NEXT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.I_WOULD_LIKE_TO_INCLUDE_YOU
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.PREFILLED_COLLABORATION_AGREEMENT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.UPLOAD_FINAL_DRAFT
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.YOUR_COLLABORATION_IS_DECLINED
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.YOUR_COLLABORATION_IS_ESTABLISHED
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.DATA_USER
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.RecipientType.DATA_AUTHOR
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
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

    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb")
    val payload: MessagePayload? = null,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(cascade = [ALL], orphanRemoval = true)
    @JoinColumn(name = "message_id", nullable = false, insertable = false, updatable = false)
    val files: List<CollaborationRequestMessageFile> = mutableListOf(),

    val isAssistant: Boolean,

    )

enum class CollaborationRequestMessageType(val step: Int, val recipientType: RecipientType) {
    //Collaboration request creator:
    AGREE_TO_THE_TERMS_OF_COLLABORATION(0, DATA_USER),
    DATASET_WAS_DOWNLOADED(1, DATA_USER),
    I_WOULD_LIKE_TO_COLLABORATE(2, DATA_USER),
    IF_YOU_ARE_INTERESTED_IN_THIS_DATASET(3, DATA_USER),
    LETS_MAKE_COLLABORATION_REQUEST(4, DATA_USER),
    FORMALIZED_AGREEMENT(5, DATA_USER),
    GOT_IT_READY_TO_START(6, DATA_USER),
    VERIFY_YOUR_NAME_AND_AFFILIATION(7, DATA_USER),
    I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL(8, DATA_USER),
    PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE(9, DATA_USER),
    DONE_WHATS_NEXT(10, DATA_USER),
    PREFILLED_COLLABORATION_AGREEMENT(11, DATA_USER),
    EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST(12, DATA_USER),
    FIRST_STEP_IS_COMPLETED(13, DATA_USER),
    YOUR_COLLABORATION_IS_ESTABLISHED(14, DATA_USER),
    YOUR_COLLABORATION_IS_DECLINED(14, DATA_USER),
    ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST(15, DATA_USER),
    ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST(15, DATA_USER),
    UPLOAD_FINAL_DRAFT(16, DATA_USER),
    AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE(17, DATA_USER),
    AUTHOR_APPROVED(18, DATA_USER),
    AUTHOR_DECLINED(19, DATA_USER),
    ALL_AUTHORS_CONFIRMED(20, DATA_USER),

    CHANGE_MY_PERSONAL_INFO(0, DATA_USER),
    CHANGE_INFO_ABOUT_MY_PUBLICATION(0, DATA_USER),

//    UPLOAD_FINAL_DRAFT(15, COLLABORATION_REQUEST_CREATOR),
//    NOTIFY_CO_AUTHOR(15, COLLABORATION_REQUEST_CREATOR),
//    ASK_DATA_AUTHOR(15, COLLABORATION_REQUEST_CREATOR),
//    I_NEED_HELP(15, COLLABORATION_REQUEST_CREATOR),

    //Publication creator
    I_WOULD_LIKE_TO_INCLUDE_YOU(0, DATA_AUTHOR),
    ASSISTANT_CREATE(1, DATA_AUTHOR),
    APPROVE_COLLABORATION(2, DATA_AUTHOR),
    DECLINE_COLLABORATION(2, DATA_AUTHOR),
    ASSISTANT_COLLABORATION_DECLINED(3, DATA_AUTHOR),
    ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER(4, DATA_AUTHOR),
    APPROVE_MANUSCRIPT(5, DATA_AUTHOR),
    DECLINE_MANUSCRIPT(5, DATA_AUTHOR),
    ASSISTANT_MANUSCRIPT_APPROVED(6, DATA_AUTHOR),

    DEFAULT(2, DATA_AUTHOR),
    COLLABORATION_APPROVED(3, DATA_AUTHOR),
    DATA_USER_ASKED(4, DATA_AUTHOR),
    MANUSCRIPT_APPROVED(5, DATA_AUTHOR),
    DECLINED(6, DATA_AUTHOR),
    AUTHOR_INFO_RECEIVED(7, DATA_AUTHOR),
    PUBLICATION_INFO_RECEIVED(8, DATA_AUTHOR),

    EMAIL_DATA_USER(0, DATA_AUTHOR)
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = IWouldLikeToIncludeYouAsCoAuthor::class, name = "I_WOULD_LIKE_TO_INCLUDE_YOU"),
        JsonSubTypes.Type(value = PersonalDataConfirmation::class, name = "I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL"),
        JsonSubTypes.Type(value = PotentialPublicationData::class, name = "DONE_WHATS_NEXT"),
        JsonSubTypes.Type(value = UploadFinalDraftPayload::class, name = "UPLOAD_FINAL_DRAFT"),
        JsonSubTypes.Type(value = AuthorApprovedPayload::class, name = "AUTHOR_APPROVED"),
        JsonSubTypes.Type(value = YourCollaborationIsDeclinedPayload::class, name = "YOUR_COLLABORATION_IS_DECLINED"),
        JsonSubTypes.Type(value = PrefilledCollaborationAgreementPayload::class, name = "PREFILLED_COLLABORATION_AGREEMENT"),
        JsonSubTypes.Type(value = YourCollaborationIsEstablishedPayload::class, name = "YOUR_COLLABORATION_IS_ESTABLISHED"),
        JsonSubTypes.Type(value = FinalDraftAttachedByDataUser::class, name = "ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER"),
        JsonSubTypes.Type(value = ApproveManuscriptPayload::class, name = "APPROVE_MANUSCRIPT")
    ]
)

interface MessagePayload {
    var type: CollaborationRequestMessageType
}

class IWouldLikeToIncludeYouAsCoAuthor(
    val potentialPublicationTitle: String,
    val typeOfWork: CollaborationRequestTypeOfWork,
    val intendedJournalForPublication: String,
    val detailsOfResearch: String,
    override var type: CollaborationRequestMessageType = I_WOULD_LIKE_TO_INCLUDE_YOU,
) : MessagePayload

class PersonalDataConfirmation(
    val firstName: String,
    val lastName: String,
    val workplaces: List<Workplace>,
    override var type: CollaborationRequestMessageType = I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL,
) : MessagePayload

class PotentialPublicationData(
    val potentialPublicationTitle: String,
    val typeOfWork: CollaborationRequestTypeOfWork,
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
    val decisionAuthor: AuthorShortInfo,
    val decisionAuthorComment: String?,
    val expectedApprovingAuthors: List<AuthorShortInfo>,
    override var type: CollaborationRequestMessageType = AUTHOR_APPROVED
) : MessagePayload

class YourCollaborationIsDeclinedPayload(
    val decisionAuthor: AuthorShortInfo,
    val decisionAuthorComment: String?,
    val expectedApprovingAuthors: List<AuthorShortInfo>,
    override var type: CollaborationRequestMessageType = YOUR_COLLABORATION_IS_DECLINED
) : MessagePayload

class PrefilledCollaborationAgreementPayload(
    val authors: List<AuthorShortInfo>,
    override var type: CollaborationRequestMessageType = PREFILLED_COLLABORATION_AGREEMENT
) : MessagePayload

class FinalDraftAttachedByDataUser(
    val dataUser: UserInfo,
    override var type: CollaborationRequestMessageType = ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER
) : MessagePayload

class YourCollaborationIsEstablishedPayload(
    val author: AuthorShortInfo,
    override var type: CollaborationRequestMessageType = YOUR_COLLABORATION_IS_ESTABLISHED
) : MessagePayload

class ApproveManuscriptPayload(
    val comment: String?,
    override var type: CollaborationRequestMessageType = APPROVE_MANUSCRIPT
) : MessagePayload

fun CollaborationRequestMessage.toApiObject(userService: UserService) = toApiObject(user.toApiObject(userService))

fun CollaborationRequestMessage.toApiObject(userInfo: UserInfo) = CollaborationRequestMessageApiObject(
    CollaborationMessageTypeApiObject.valueOf(type.toString()),
    false
).also {
    it.id = this.id
    it.userInfo = userInfo.takeIf { user.id == userInfo.id }
        ?: throw IllegalArgumentException("UserInfo id ${userInfo.id} doesn't match with user.id ${user.id}")
    it.payload = payload
    it.isAssistant = isAssistant
    it.sequenceIndex = sequenceIndex
    it.files = files.map { file -> file.toApiObject() }
    it.creationTime = creationTime.toOffsetDateTime()
}
