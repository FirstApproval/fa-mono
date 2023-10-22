package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.FetchType.LAZY
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.Workplace as WorkplaceApiObject

@Entity
@Table(name = "users_workplaces")
class Workplace(
    @Id
    var id: UUID = randomUUID(),
    @Fetch(SELECT)
    @ManyToOne(fetch = EAGER)
    var organization: Organization,
    var organizationDepartment: String? = null,
    @ManyToOne(fetch = LAZY, cascade = [CascadeType.REFRESH])
    @JoinColumn(nullable = false, updatable = false)
    var user: User,
    var address: String? = null,
    var postalCode: String? = null,
    var creationTime: ZonedDateTime = now(),
    var editingTime: ZonedDateTime = now(),
)

fun Workplace.toApiObject() = WorkplaceApiObject().also {
    it.id = id
    it.organization = organization.toApiObject()
    it.department = organizationDepartment
    it.address = address
    it.postalCode = postalCode
    it.creationTime = creationTime.toOffsetDateTime()
}
