package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import org.firstapproval.backend.core.config.encryption.StringListEncryptionConverter
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.LicenseType.ATTRIBUTION_NO_DERIVATIVES
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
    var id: String,
    @ManyToOne(fetch = EAGER)
    @JoinColumn(updatable = false)
    val creator: User,
    @Enumerated(STRING)
    var status: PublicationStatus = PENDING,
    @Enumerated(STRING)
    var accessType: AccessType = OPEN,
    @Enumerated(STRING)
    var storageType: StorageType? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var previewTitle: String? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var previewSubtitle: String? = null,
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
    var editingTime: ZonedDateTime = now(),
    var publicationTime: ZonedDateTime? = null,
    @Convert(converter = StringEncryptionConverter::class)
    var archivePassword: String? = null,
    var archiveSize: Long? = null,
    var archiveSampleSize: Long? = null,
    var contentId: Long? = null,
    var isFeatured: Boolean = false,
    var isNegative: Boolean = false,
    var negativeData: String? = null,
    var filesCount: Long? = null,
    var foldersCount: Long? = null,
    var hash: String? = null,
    @Enumerated(STRING)
    var licenseType: LicenseType = ATTRIBUTION_NO_DERIVATIVES,
)

enum class PublicationStatus {
    PENDING,
    READY_FOR_PUBLICATION,
    PUBLISHED
}

enum class AccessType {
    OPEN,
}

enum class LicenseType {
    ATTRIBUTION_NO_DERIVATIVES,
    ATTRIBUTION_NO_DERIVATIVES_NON_COMMERCIAL,
}

enum class StorageType {
    CLOUD_SECURE_STORAGE,
    IPFS,
}
