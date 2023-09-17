package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import java.time.ZonedDateTime
import org.firstapproval.api.server.model.OrganizationDepartment as OrganizationDepartmentApiObject

private const val SEQUENCE_NAME = "organizations_departments_seq"

@Entity
@Table(name = "organizations_departments")
class OrganizationDepartment(
    @Id
    @SequenceGenerator(name = SEQUENCE_NAME, sequenceName = SEQUENCE_NAME)
    @GeneratedValue(generator = SEQUENCE_NAME)
    var id: Long = 0,
    @ManyToOne
    var organization: Organization,
    var name: String,
    var creationTime: ZonedDateTime,
)

fun OrganizationDepartment.toApiObject() = OrganizationDepartmentApiObject()
    .also {
        it.id = id
        it.name = name
    }
