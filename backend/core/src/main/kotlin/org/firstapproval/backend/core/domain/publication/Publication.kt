package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import org.firstapproval.backend.core.config.encryption.StringListEncryptionConverter
import org.firstapproval.backend.core.domain.publication.AccessType.CLOSED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthor
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.ColumnTransformer
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "publications")
class Publication(
    @Id
    var id: UUID,
    @ManyToOne(fetch = EAGER)
    @JoinColumn(updatable = false)
    val creator: User,
    @Enumerated(STRING)
    var status: PublicationStatus = PENDING,
    @Enumerated(STRING)
    var accessType: AccessType = CLOSED,
    @Convert(converter = StringEncryptionConverter::class)
    var title: String? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var researchArea: String? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var description: List<String>? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var grantOrganizations: List<String>? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var relatedArticles: List<String>? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var tags: List<String>? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var objectOfStudyTitle: String? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var objectOfStudyDescription: List<String>? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var software: List<String>? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var methodTitle: String? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var methodDescription: List<String>? = null,
    @Column(columnDefinition = "text[]")
    @ColumnTransformer(write = "?::text[]")
    @Convert(converter = StringListEncryptionConverter::class)
    var predictedGoals: List<String>? = null,
    @OneToMany(fetch = EAGER, cascade = [ALL], orphanRemoval = true, mappedBy = "publication")
    var confirmedAuthors: MutableList<ConfirmedAuthor> = mutableListOf(),
    @OneToMany(fetch = EAGER)
    @JoinTable(
        name = "publication_unconfirmed_authors",
        joinColumns = [JoinColumn(name = "publication_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var unconfirmedAuthors: List<UnconfirmedUser> = mutableListOf(),
    var creationTime: ZonedDateTime = now(),
    var publicationTime: ZonedDateTime? = null,
    var contentId: Long? = null,
    var isFeatured: Boolean = false,
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
