package org.firstapproval.backend.core.domain.publication.authors

import jakarta.persistence.CascadeType
import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.organizations.UnconfirmedAuthorWorkplace
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import org.firstapproval.backend.core.domain.publication.Publication
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import java.util.UUID

@Entity
@Table(name = "publication_unconfirmed_authors")
class UnconfirmedAuthor(
    @Id
    var id: UUID,
    @ManyToOne(fetch = EAGER, cascade = [REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var publication: Publication,
    var email: String? = null,
    var firstName: String? = null,
    var middleName: String? = null,
    var lastName: String? = null,
    @Fetch(FetchMode.SELECT)
    @OneToMany(fetch = EAGER, cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "unconfirmedAuthor")
    var workplaces: MutableList<UnconfirmedAuthorWorkplace> = mutableListOf(),
    var creationTime: ZonedDateTime = now(),
)
