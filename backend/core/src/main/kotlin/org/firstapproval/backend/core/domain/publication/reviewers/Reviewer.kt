package org.firstapproval.backend.core.domain.publication.reviewers

import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "publications_reviewers")
class Reviewer(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER, cascade = [REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var publication: Publication,
    var email: String? = null,
    var firstName: String? = null,
    var lastName: String? = null,
    var creationTime: ZonedDateTime = now(),
) {
}
