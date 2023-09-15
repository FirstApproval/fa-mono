package org.firstapproval.backend.core.domain.organizations

import jakarta.persistence.*
import jakarta.persistence.FetchType.EAGER
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode.SELECT
import java.time.ZonedDateTime

private const val SEQUENCE_NAME = "organizations_seq"

@Entity
@Table(name = "organizations")
class Organization(
    @Id
    @SequenceGenerator(name = SEQUENCE_NAME, sequenceName = SEQUENCE_NAME)
    @GeneratedValue(generator = SEQUENCE_NAME)
    var id: Long,
    @Fetch(SELECT)
    @OneToMany(fetch = EAGER, cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "organization")
    var departments: Set<OrganizationDepartment>,
    var name: String,
    var creationTime: ZonedDateTime,
)
