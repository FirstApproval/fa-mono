package org.firstapproval.backend.core.domain.user

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "users")
class User(
    @Id
    var id: UUID,
    var username: String,
    var firstName: String? = null,
    var middleName: String? = null,
    var lastName: String? = null,
    var fullName: String? = null,
    @ElementCollection(fetch = EAGER)
    @CollectionTable(name = "external_ids")
    @MapKeyEnumerated(STRING)
    @MapKeyClass(OauthType::class)
    @MapKeyColumn(name = "type")
    @Column(name = "external_id")
    var externalIds: MutableMap<OauthType, String> = mutableMapOf(),
    @Convert(converter = StringEncryptionConverter::class)
    var email: String? = null,
    var password: String? = null,
    var selfInfo: String? = null,
    var profileImage: String? = null,
    var creationTime: ZonedDateTime = now(),
    var viewsCount: Long = 0,
)
