package org.firstapproval.backend.core.domain.publication.collaboration.requests.authors

import jakarta.persistence.Entity
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.api.server.model.CollaborationAuthorDecisionStatus
import org.firstapproval.api.server.model.CollaborationRequestAuthorInvitationStatus
import org.firstapproval.backend.core.domain.publication.authors.Author
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationAuthorInvitationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.collaboration.requests.toApiObject
import java.time.ZonedDateTime
import java.util.*
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_requests_invited_authors")
class CollaborationRequestInvitedAuthor(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER)
    val collaborationRequest: CollaborationRequest,
    @ManyToOne(fetch = EAGER)
    val author: Author,
    @Enumerated(STRING)
    var status: CollaborationAuthorInvitationStatus = PENDING,
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
    var editingTime: ZonedDateTime = ZonedDateTime.now(),
)

enum class CollaborationAuthorInvitationStatus {
    PENDING,
    COLLABORATION_APPROVED,
    COLLABORATION_DECLINED,
    MANUSCRIPT_APPROVED,
    MANUSCRIPT_DECLINED,
}

fun CollaborationRequestInvitedAuthor.toApiObject() = CollaborationRequestAuthorInvitationStatus().also {
    it.status = CollaborationAuthorDecisionStatus.valueOf(status.name)
    it.collaborationRequest = collaborationRequest.toApiObject()
}
