package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import org.firstapproval.backend.core.domain.publication.AccessType.CLOSED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "publications")
class Publication(
    @Id
    var id: UUID,
    @ManyToOne
    val creator: User,
    @Enumerated(STRING)
    var status: PublicationStatus = PENDING,
    @Enumerated(STRING)
    var accessType: AccessType = CLOSED,
    var title: String? = null,
    var description: String? = null,
    @Column(columnDefinition = "text")
    var grantOrganizations: List<String>? = null,
    @Column(columnDefinition = "text")
    var relatedArticles: List<String>? = null,
    @Column(columnDefinition = "text")
    var tags: List<String>? = null,
    var objectOfStudyTitle: String? = null,
    @Column(columnDefinition = "text")
    var objectOfStudyDescription: List<String>? = null,
    @Column(columnDefinition = "text")
    var software: List<String>? = null,
    var methodTitle: String? = null,
    @Column(columnDefinition = "text")
    var methodDescription: List<String>? = null,
    @Column(columnDefinition = "text")
    var predictedGoals: List<String>? = null,
    @ManyToMany
    @JoinTable(
        name = "publication_confirmed_authors",
        joinColumns = [JoinColumn(name = "publication_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var confirmedAuthors: List<User> = mutableListOf(),
    @ManyToMany
    @JoinTable(
        name = "publication_unconfirmed_authors",
        joinColumns = [JoinColumn(name = "publication_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var unconfirmedAuthors: List<UnconfirmedUser> = mutableListOf(),
    var creationTime: ZonedDateTime = now(),
    var publicationTime: ZonedDateTime? = null,
    var contentId: Long? = null,
)

enum class PublicationStatus {
    PENDING,
    READY_FOR_PUBLICATION,
    PUBLISHED
}

enum class AccessType {
    CLOSED,
    OPEN,
    ON_REQUEST,
    MONETIZE_OR_CO_AUTHORSHIP
}
