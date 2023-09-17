package org.firstapproval.backend.core.domain.organizations

import org.springframework.data.jpa.repository.JpaRepository

interface OrganizationDepartmentRepository : JpaRepository<OrganizationDepartment, Long> {
}
