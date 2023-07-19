package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType
import org.springframework.data.elasticsearch.annotations.FieldType.Keyword
import org.springframework.data.elasticsearch.annotations.FieldType.Text
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Document(indexName = "publications")
@Table(name = "publications")
class Publication(
    @Id
    var id: UUID,
    @ManyToOne
    val creator: User,
    @Enumerated(STRING)
    var status: PublicationStatus = PENDING,
    @Enumerated(STRING)
    var accessType: AccessType? = null,
    @Field(type = Text)
    var title: String? = null,
    @Field(type = Text)
    var description: String? = null,
    @Column(columnDefinition = "text")
    @Field(type = Keyword)
    var grantOrganizations: List<String>? = null,
    @Column(columnDefinition = "text")
    var relatedArticles: List<String>? = null,
    @Column(columnDefinition = "text")
    @Field(type = Keyword)
    var tags: List<String>? = null,
    @Field(type = Text)
    var objectOfStudyTitle: String? = null,
    @Field(type = Text)
    var objectOfStudyDescription: String? = null,
    @Field(type = Keyword)
    var software: String? = null,
    @Field(type = Keyword)
    var methodTitle: String? = null,
    @Field(type = Text)
    var methodDescription: String? = null,
    var predictedGoals: String? = null,
    @ManyToMany(fetch = EAGER)
    @JoinTable(
        name = "publication_confirmed_authors",
        joinColumns = [JoinColumn(name = "publication_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var confirmedAuthors: List<User> = mutableListOf(),
    @ManyToMany(fetch = EAGER)
    @JoinTable(
        name = "publication_unconfirmed_authors",
        joinColumns = [JoinColumn(name = "publication_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var unconfirmedAuthors: List<UnconfirmedUser> = mutableListOf(),
    var creationTime: ZonedDateTime = now(),
    @Field(type = FieldType.Date_Nanos)
    var publicationTime: ZonedDateTime? = null,
    var contentId: Long? = null,
)

enum class PublicationStatus {
    PENDING,
    READY_FOR_PUBLICATION,
    PUBLISHED
}

enum class AccessType {
    OPEN,
    ON_REQUEST,
    MONETIZE_OR_CO_AUTHORSHIP
}
