package org.firstapproval.backend.core.domain.user

import jakarta.persistence.*
import jakarta.persistence.CascadeType.ALL
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.FetchType.EAGER
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import org.firstapproval.backend.core.domain.organizations.Workplace
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "users")
class User(
    @Id
    var id: UUID,
    var username: String,
    var firstName: String,
    var middleName: String? = null,
    var lastName: String,
    var fullName: String? = null,
    @Fetch(SELECT)
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
    var profileImage: String? = null,
    var creationTime: ZonedDateTime = now(),
    var viewsCount: Long = 0,
    @Fetch(SELECT)
    @OneToMany(fetch = EAGER, cascade = [ALL], orphanRemoval = true, mappedBy = "user")
    var workplaces: MutableList<Workplace> = mutableListOf(),
    var isNameConfirmed: Boolean = false,
    var isWorkplacesConfirmed: Boolean = false,
    var utmSource: String? = null,
) {
    val workplacesNames: String
        get() = workplaces.filter { it.organization.moderated }
            .joinToString(postfix = ".") {
                (it.organization.name + " ${it.organizationDepartment}").trim()
            }
}

fun User.toApiObject(userService: UserService) = UserInfo().also {
    it.id = id
    it.firstName = firstName
    it.middleName = middleName
    it.lastName = lastName
    it.email = email
    it.username = username
    it.profileImage = userService.getProfileImage(profileImage)
    it.workplaces = workplaces.map { workplace -> workplace.toApiObject() }
}
