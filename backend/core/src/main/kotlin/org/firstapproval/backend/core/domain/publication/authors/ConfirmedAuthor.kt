package org.firstapproval.backend.core.domain.publication.authors

import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID

@Entity
@Table(name = "publication_confirmed_authors")
class ConfirmedAuthor(
    @Id
    var id: UUID,
    @ManyToOne(fetch = EAGER)
    var user: User,
    @ManyToOne(fetch = EAGER, cascade = [REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var publication: Publication,
    var shortBio: String? = null,
    var creationTime: ZonedDateTime = now(),
)
