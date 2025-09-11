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
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "publications_authors")
class Author(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER, cascade = [REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var publication: Publication,
    var email: String? = null,
    var firstName: String? = null,
    var lastName: String? = null,
    var ordinal: Int = 0,
    @ManyToOne(fetch = EAGER)
    var user: User? = null,
    var isConfirmed: Boolean,
    var isAcademicSupervisor: Boolean = false,
    @Fetch(SELECT)
    @OneToMany(fetch = EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "author_id", nullable = false)
    var workplaces: MutableList<AuthorWorkplace> = mutableListOf(),
    var creationTime: ZonedDateTime = now(),
) {
    val workplacesNames: String
        get() = workplaces.filter { it.organization.moderated }
            .joinToString(postfix = ".") { (it.organization.name).trim() }

    constructor(
        id: UUID = randomUUID(),
        publication: Publication,
        user: User,
        ordinal: Int,
        workplaces: MutableList<AuthorWorkplace>,
        creationTime: ZonedDateTime
    ) :
        this(
            id = id,
            publication = publication,
            email = user.email,
            firstName = user.firstName,
            lastName = user.lastName,
            ordinal = ordinal,
            user = user,
            isConfirmed = true,
            workplaces = workplaces,
            creationTime = creationTime
        )
}
