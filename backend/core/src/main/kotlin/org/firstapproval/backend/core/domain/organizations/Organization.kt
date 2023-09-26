package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import jakarta.persistence.FetchType.EAGER
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import org.firstapproval.api.server.model.Organization as OrganizationApiObject

private const val SEQUENCE_NAME = "organizations_seq"

@Entity
@Table(name = "organizations")
class Organization(
    @Id
    @SequenceGenerator(name = SEQUENCE_NAME, sequenceName = SEQUENCE_NAME)
    @GeneratedValue(generator = SEQUENCE_NAME)
    var id: Long = 0,
    @Fetch(SELECT)
    @OneToMany(fetch = EAGER, cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "organization")
    var departments: Set<OrganizationDepartment> = setOf(),
    var name: String,
    var countryName: String? = null,
    var countryCode: String? = null,
    var city: String? = null,
    var moderated: Boolean = false,
    var creationTime: ZonedDateTime,
)

fun Organization.toApiObject() = OrganizationApiObject().also {
    it.id = id
    it.name = name
    it.departments = departments.map { department -> department.toApiObject() }
}
