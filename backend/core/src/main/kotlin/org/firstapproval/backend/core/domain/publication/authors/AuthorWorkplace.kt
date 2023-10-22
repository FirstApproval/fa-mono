package org.firstapproval.backend.core.domain.publication.authors

import jakarta.persistence.CascadeType.REFRESH
import jakarta.persistence.Entity
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.organizations.Organization
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.Workplace as WorkplaceApiObject

@Entity
@Table(name = "publication_authors_workplaces")
class AuthorWorkplace(
    @Id
    var id: UUID? = randomUUID(),
    @Fetch(SELECT)
    @ManyToOne(fetch = EAGER)
    var organization: Organization,
    var organizationDepartment: String? = null,
    var address: String? = null,
    var postalCode: String? = null,
    var creationTime: ZonedDateTime = now(),
    var editingTime: ZonedDateTime = now(),
)

fun AuthorWorkplace.toApiObject() = WorkplaceApiObject().also {
    it.id = id
    it.organization = organization.toApiObject()
    it.department = organizationDepartment
    it.address = address
    it.postalCode = postalCode
    it.creationTime = creationTime.toOffsetDateTime()
}
