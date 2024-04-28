package org.firstapproval.backend.core.domain.publication.collaboration.requests

import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.Entity
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.api.server.model.CollaborationRequestTypeOfWork
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequestStatus.PENDING
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.CollaborationRequestStatus as CollaborationRequestStatusApiObject

@Entity
@Table(name = "collaboration_requests")
class CollaborationRequest(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER, cascade = [REFRESH])
    val publication: Publication,
    val firstNameLegal: String,
    val lastNameLegal: String,
    @Enumerated(STRING)
    val typeOfWork: TypeOfWork,
    var authorResponse: String? = null,
    @ManyToOne(fetch = EAGER)
    val user: User,
    @Enumerated(STRING)
    var status: CollaborationRequestStatus = PENDING,
    val description: String? = null,
    val creationTime: ZonedDateTime = ZonedDateTime.now(),
    var decisionTime: ZonedDateTime? = null,
    var autoApproval: Boolean? = false
)

enum class CollaborationRequestStatus {
    ACCEPTED,
    REJECTED,
    PENDING
}

enum class TypeOfWork {
    ARTICLE,
    DATASET,
    OTHER_PUBLICATION
}

fun CollaborationRequest.toApiObject(userService: UserService) = CollaborationRequestInfo().also {
    it.id = id
    it.status = CollaborationRequestStatusApiObject.valueOf(status.name)
    it.userInfo = user.toApiObject(userService)
    it.publicationTitle = publication.title
    it.publicationId = publication.id
    it.firstNameLegal = firstNameLegal
    it.lastNameLegal = lastNameLegal
    it.typeOfWork = CollaborationRequestTypeOfWork.fromValue(typeOfWork.name)
    it.description = description
    it.creationTime = creationTime.toOffsetDateTime()
    it.decisionTime = decisionTime?.toOffsetDateTime()
}
