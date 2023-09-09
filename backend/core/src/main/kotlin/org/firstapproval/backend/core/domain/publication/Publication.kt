package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import org.firstapproval.backend.core.config.encryption.StringListEncryptionConverter
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthor
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthor
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
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
    var accessType: AccessType = OPEN,
    @Convert(converter = StringEncryptionConverter::class)
    var title: String? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var researchAreas: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var description: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var grantOrganizations: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var primaryArticles: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var relatedArticles: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var tags: List<String>? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var objectOfStudyTitle: String? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var objectOfStudyDescription: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var software: List<String>? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var methodTitle: String? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var methodDescription: List<String>? = null,
    @ColumnTransformer(write = "?::text")
    @Convert(converter = StringListEncryptionConverter::class)
    var predictedGoals: List<String>? = null,
    @Fetch(value = SELECT)
    @OneToMany(fetch = EAGER, cascade = [ALL], orphanRemoval = true, mappedBy = "publication")
    var confirmedAuthors: MutableList<ConfirmedAuthor> = mutableListOf(),
    @Fetch(value = SELECT)
    @OneToMany(fetch = EAGER, cascade = [ALL], orphanRemoval = true, mappedBy = "publication")
    var unconfirmedAuthors: MutableList<UnconfirmedAuthor> = mutableListOf(),
    var downloadsCount: Long = 0,
    var viewsCount: Long = 0,
    var creationTime: ZonedDateTime = now(),
    var publicationTime: ZonedDateTime? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var archivePassword: String? = null,
    var archiveSize: Long? = null,
    var archiveSampleSize: Long? = null,
    var contentId: Long? = null,
    var isFeatured: Boolean = false,
    var isNegative: Boolean = false,
    var negativeData: String? = null,
) {
    fun getAuthorsFIOHtml(): String {
        val confirmedAuthors = confirmedAuthors.joinToString(", ") { "${it.user.lastName} ${it.user.firstName}" }
        val unconfirmedAuthors = unconfirmedAuthors.joinToString(", ") { "${it.lastName} ${it.firstName}" }

        val authors = when {
            confirmedAuthors.isNotBlank() && unconfirmedAuthors.isNotBlank() -> "$confirmedAuthors, $unconfirmedAuthors."
            confirmedAuthors.isNotBlank() -> "$confirmedAuthors."
            unconfirmedAuthors.isNotBlank() -> "$unconfirmedAuthors."
            else -> "."
        }
        return authors
    }

    fun getAuthorsAndShortBioHtml(): String {
        val confirmedAuthors = confirmedAuthors.joinToString("\n") {
            "<div><span class='author'>${it.user.lastName} ${it.user.firstName}</span>: ${it.shortBio ?: ""}</div>"
        }
        val unconfirmedAuthors = unconfirmedAuthors.joinToString("\n") {
            "<div><span class='author'>${it.lastName} ${it.firstName}</span>: ${it.shortBio ?: ""}</div>"
        }
        return "$confirmedAuthors\n$unconfirmedAuthors"
    }
}

enum class PublicationStatus {
    PENDING,
    READY_FOR_PUBLICATION,
    PUBLISHED
}

enum class AccessType {
    OPEN,
}
