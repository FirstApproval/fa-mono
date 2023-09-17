package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.util.*
import org.firstapproval.api.server.model.Workplace as WorkplaceApiObject

@Entity
@Table(name = "users_workplaces")
class Workplace(
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
    var user: User,
    var address: String,
    var postalCode: String,
    var isFormer: Boolean,
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
    var editingTime: ZonedDateTime = ZonedDateTime.now(),
)

fun Workplace.toApiObject() = WorkplaceApiObject().also {
    it.id = id
    it.organization = organization.toApiObject()
    it.department = organizationDepartment?.toApiObject()
    it.address = address
    it.postalCode = postalCode
    it.isFormer = isFormer
    it.creationTime = creationTime.toOffsetDateTime()
}
