package org.firstapproval.backend.core.domain.publication.collaborator.requests

import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.api.server.model.CollaborationRequestInfo
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_requests")
class CollaborationRequest(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER)
    val publication: Publication,
    @ManyToOne(fetch = EAGER)
    val user: User,
    val creationTime: ZonedDateTime = ZonedDateTime.now(),
    var approvalTime: ZonedDateTime? = null,
    var rejectionTime: ZonedDateTime? = null,
    val autoApproval: Boolean? = false
)

fun CollaborationRequest.toApiObject(userService: UserService) = CollaborationRequestInfo().also {
    it.id = id
    it.userInfo = user.toApiObject(userService)
    it.publicationTitle = publication.title
    it.publicationId = publication.id
}
