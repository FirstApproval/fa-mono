package org.firstapproval.backend.core.domain.publication.collaboration.requests.authors

import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.authors.Author
import org.firstapproval.backend.core.domain.publication.collaboration.requests.CollaborationRequest
import org.firstapproval.backend.core.domain.publication.collaboration.requests.authors.CollaborationDecisionStatus.PENDING
import java.time.ZonedDateTime
import java.util.*
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaboration_requests_authors")
class CollaborationRequestAuthor(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER)
    val collaborationRequest: CollaborationRequest,
    @ManyToOne(fetch = EAGER)
    val author: Author,
    var status: CollaborationDecisionStatus = PENDING,
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
    var editingTime: ZonedDateTime = ZonedDateTime.now(),
)

enum class CollaborationDecisionStatus { PENDING, APPROVED, DECLINED }
