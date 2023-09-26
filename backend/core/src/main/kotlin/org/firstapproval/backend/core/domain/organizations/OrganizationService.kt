package org.firstapproval.backend.core.domain.organizations

import org.springframework.stereotype.Service
import java.time.ZonedDateTime
import org.firstapproval.api.server.model.Organization as OrganizationApiObject
import org.firstapproval.api.server.model.OrganizationDepartment as OrganizationDepartmentApiObject

@Service
class OrganizationService(
    private val organizationRepository: OrganizationRepository,
    private val orgDepartmentRepository: OrganizationDepartmentRepository
) {
    fun getOrSave(organization: OrganizationApiObject): Organization {
        return organization.id?.let { organizationRepository.getReferenceById(it) }
            ?: organizationRepository.findByName(organization.name)
            ?: organizationRepository.saveAndFlush(
                Organization(name = organization.name, creationTime = ZonedDateTime.now())
            )
    }

    fun getOrSave(department: OrganizationDepartmentApiObject?, organization: Organization): OrganizationDepartment? {
        if (department?.name == null) {
            return null
        }

        return department.id?.let { orgDepartmentRepository.getReferenceById(it) }
            ?: orgDepartmentRepository.save(
                OrganizationDepartment(
                    organization = organization,
                    name = department.name,
                    creationTime = ZonedDateTime.now()
                )
            )
    }
}
