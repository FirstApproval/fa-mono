package org.firstapproval.backend.core.domain.publication.collaboration.chats.messages

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.CollaborationRequestMessageFile
import org.firstapproval.backend.core.domain.publication.collaboration.chats.files.toApiObject
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.*
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.RecipientType.DATA_AUTHOR
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessageType.RecipientType.DATA_USER
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import java.util.*
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

    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb")
    val payload: MessagePayload? = null,

    val sequenceIndex: Int,

    val creationTime: ZonedDateTime = ZonedDateTime.now(),

    @OneToMany(cascade = [ALL], orphanRemoval = true)
    @JoinColumn(name = "message_id", nullable = false, insertable = false, updatable = false)
    val files: List<CollaborationRequestMessageFile> = mutableListOf(),
)

enum class CollaborationRequestMessageType(val step: Int, val recipientType: RecipientType, val senderType: SenderType) {
    //Collaboration request creator:
    AGREE_TO_THE_TERMS_OF_COLLABORATION(0, DATA_USER, SenderType.DATA_USER),
    DATASET_WAS_DOWNLOADED(1, DATA_USER, SenderType.ASSISTANT),
    I_WOULD_LIKE_TO_COLLABORATE(2, DATA_USER, SenderType.DATA_USER),
    IF_YOU_ARE_INTERESTED_IN_THIS_DATASET(3, DATA_USER, SenderType.ASSISTANT),
    LETS_MAKE_COLLABORATION_REQUEST(4, DATA_USER, SenderType.DATA_USER),
    FORMALIZED_AGREEMENT(5, DATA_USER, SenderType.ASSISTANT),
    GOT_IT_READY_TO_START(6, DATA_USER, SenderType.DATA_USER),
    VERIFY_YOUR_NAME_AND_AFFILIATION(7, DATA_USER, SenderType.ASSISTANT),
    I_CONFIRM_THAT_PROVIDED_INFO_IS_REAL(8, DATA_USER, SenderType.DATA_USER),
    PROPOSE_POTENTIAL_PUBLICATION_NAME_AND_TYPE(9, DATA_USER, SenderType.ASSISTANT),
    DONE_WHATS_NEXT(10, DATA_USER, SenderType.DATA_USER),
    PREFILLED_COLLABORATION_AGREEMENT(11, DATA_USER, SenderType.ASSISTANT),
    EVERYTHING_IS_CORRECT_SIGN_AND_SEND_REQUEST(12, DATA_USER, SenderType.DATA_USER),
    FIRST_STEP_IS_COMPLETED(13, DATA_USER, SenderType.ASSISTANT),
    YOUR_COLLABORATION_IS_ESTABLISHED(14, DATA_USER, SenderType.ASSISTANT),
    YOUR_COLLABORATION_IS_DECLINED(14, DATA_USER, SenderType.ASSISTANT),
    ALL_DATA_AUTHORS_RESPONDED_TO_COLLABORATION_REQUEST(15, DATA_USER, SenderType.ASSISTANT),
    ALL_DATA_AUTHORS_DECLINED_COLLABORATION_REQUEST(15, DATA_USER, SenderType.ASSISTANT),
    UPLOAD_FINAL_DRAFT(16, DATA_USER, SenderType.DATA_USER),
    AUTHOR_HAS_14_DAYS_TO_MAKE_REVISIONS_AND_APPROVE(17, DATA_USER, SenderType.ASSISTANT),
    AUTHOR_APPROVED(18, DATA_USER, SenderType.ASSISTANT),
    AUTHOR_DECLINED(19, DATA_USER, SenderType.ASSISTANT),
    ALL_AUTHORS_CONFIRMED(20, DATA_USER, SenderType.ASSISTANT),

    CHANGE_MY_PERSONAL_INFO(0, DATA_USER, SenderType.DATA_USER),
    CHANGE_INFO_ABOUT_MY_PUBLICATION(0, DATA_USER, SenderType.DATA_USER),

    //Publication creator
    I_WOULD_LIKE_TO_INCLUDE_YOU(0, DATA_AUTHOR, SenderType.DATA_USER),
    ASSISTANT_CREATE(1, DATA_AUTHOR, SenderType.DATA_AUTHOR),
    APPROVE_COLLABORATION(2, DATA_AUTHOR, SenderType.DATA_AUTHOR),
    DECLINE_COLLABORATION(2, DATA_AUTHOR, SenderType.DATA_AUTHOR),
    ASSISTANT_COLLABORATION_DECLINED(3, DATA_AUTHOR, SenderType.ASSISTANT),
    ASSISTANT_FINAL_DRAFT_ATTACHED_BY_DATA_USER(4, DATA_AUTHOR, SenderType.ASSISTANT),
    APPROVE_MANUSCRIPT(5, DATA_AUTHOR, SenderType.DATA_AUTHOR),
    DECLINE_MANUSCRIPT(5, DATA_AUTHOR, SenderType.DATA_AUTHOR),
    ASSISTANT_MANUSCRIPT_APPROVED(6, DATA_AUTHOR, SenderType.ASSISTANT),
    ASSISTANT_MANUSCRIPT_DECLINED(6, DATA_AUTHOR, SenderType.ASSISTANT),

    EMAIL_DATA_USER(0, DATA_AUTHOR, SenderType.DATA_AUTHOR);

    enum class RecipientType {
        DATA_USER,
        DATA_AUTHOR
    }

    enum class SenderType {
        ASSISTANT,
        DATA_AUTHOR,
        DATA_USER
    }
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
        JsonSubTypes.Type(value = AuthorDeclinedPayload::class, name = "AUTHOR_DECLINED"),
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

class AuthorDeclinedPayload(
    val decisionAuthor: AuthorShortInfo,
    val decisionAuthorComment: String?,
    val expectedApprovingAuthors: List<AuthorShortInfo>,
    override var type: CollaborationRequestMessageType = AUTHOR_DECLINED
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
).also {
    it.id = this.id
    it.userInfo = userInfo.takeIf { user.id == userInfo.id }
        ?: throw IllegalArgumentException("UserInfo id ${userInfo.id} doesn't match with user.id ${user.id}")
    it.payload = payload
    it.senderType = MessageSenderType.valueOf(type.senderType.name)
    it.sequenceIndex = type.step
    it.files = files.map { file -> file.toApiObject() }
    it.creationTime = creationTime.toOffsetDateTime()
}
