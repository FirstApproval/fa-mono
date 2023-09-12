package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import java.time.ZonedDateTime

private const val SEQUENCE_NAME = "organizations_departments_seq"

@Entity
@Table(name = "organizations_departments")
class OrganizationDepartment(
    @Id
    @SequenceGenerator(name = SEQUENCE_NAME, sequenceName = SEQUENCE_NAME)
    @GeneratedValue(generator = SEQUENCE_NAME)
    var id: Long,
    @ManyToOne
    var organization: Organization,
    var name: String,
    var creationTime: ZonedDateTime,
)
