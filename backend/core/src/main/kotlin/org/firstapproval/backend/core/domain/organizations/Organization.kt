package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
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
}
