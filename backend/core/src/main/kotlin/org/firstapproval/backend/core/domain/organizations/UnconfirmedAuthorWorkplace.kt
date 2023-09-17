package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthor
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*
import org.firstapproval.api.server.model.Workplace as WorkplaceApiObject

@Entity
@Table(name = "publication_unconfirmed_authors_workplaces")
class UnconfirmedAuthorWorkplace (
    @Id
    var id: UUID,
    @Fetch(SELECT)
    @ManyToOne(fetch = EAGER)
    var organization: Organization,
    @Fetch(SELECT)
    @ManyToOne(fetch = EAGER)
    var organizationDepartment: OrganizationDepartment? = null,
    @ManyToOne(fetch = LAZY, cascade = [CascadeType.REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var unconfirmedAuthor: UnconfirmedAuthor? = null,
    var address: String,
    var postalCode: String? = null,
    var isFormer: Boolean,
    var creationTime: ZonedDateTime = now(),
    var editingTime: ZonedDateTime = now(),
)

fun UnconfirmedAuthorWorkplace.toApiObject() = WorkplaceApiObject().also {
    it.id = id
    it.organization = organization.toApiObject()
    it.department = organizationDepartment?.toApiObject()
    it.address = address
    it.postalCode = postalCode
    it.isFormer = isFormer
    it.creationTime = creationTime.toOffsetDateTime()
}
