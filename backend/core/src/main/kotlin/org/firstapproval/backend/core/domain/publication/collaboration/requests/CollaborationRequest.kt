package org.firstapproval.backend.core.domain.publication.collaboration.requests

import jakarta.persistence.*
import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.api.server.model.CollaborationRequestTypeOfWork
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.collaboration.chats.messages.CollaborationRequestMessage
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.NEW
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationRequestAuthor
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import java.time.ZonedDateTime
import java.util.*
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationRequestStatus as CollaborationRequestStatusApiObject

@Entity
@Table(name = "collaboration_requests")
class CollaborationRequest(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER)
    val publication: Publication,
    @OneToMany(fetch = LAZY, mappedBy = "collaborationRequest")
    val authors: Set<CollaborationRequestAuthor> = setOf(),
    val firstNameLegal: String,
    val lastNameLegal: String,
//    @Enumerated(STRING)
//    val typeOfWork: TypeOfWork,
    var authorResponse: String? = null,
    @ManyToOne(fetch = EAGER)
    val user: User,
    @Enumerated(STRING)
    var status: CollaborationRequestStatus = NEW,
    val description: String? = null,
    val creationTime: ZonedDateTime = ZonedDateTime.now(),
    var decisionTime: ZonedDateTime? = null,
    var autoApproval: Boolean? = false,
    val isFinished: Boolean = false,
    @OneToMany(mappedBy = "collaborationRequest", cascade = [CascadeType.ALL], orphanRemoval = true)
    val messages: List<CollaborationRequestMessage> = mutableListOf()
)

enum class CollaborationRequestStatus {
    NEW,
    PENDING,
    APPROVED,
    DECLINED
}

enum class TypeOfWork {
    ARTICLE,
    DATASET,
    OTHER_PUBLICATION
}

fun CollaborationRequest.toApiObject(userService: UserService) = toApiObject(user.toApiObject(userService))

fun CollaborationRequest.toApiObject(userInfo: UserInfo) = CollaborationRequestInfo().also {
    it.id = id
    it.status = CollaborationRequestStatusApiObject.valueOf(status.name)
    it.userInfo = userInfo
    it.publicationTitle = publication.title
    it.publicationId = publication.id
    it.firstNameLegal = firstNameLegal
    it.lastNameLegal = lastNameLegal
    it.description = description
    it.creationTime = creationTime.toOffsetDateTime()
    it.decisionTime = decisionTime?.toOffsetDateTime()
}
