package org.firstapproval.backend.core.domain.organizations

import org.springframework.stereotype.Service
import java.time.ZonedDateTime.now
import org.firstapproval.api.server.model.Organization as OrganizationApiObject

@Service
class OrganizationService(
    private val organizationRepository: OrganizationRepository,
) {
    fun getOrSave(organization: OrganizationApiObject): Organization {
        return organization.id?.let { organizationRepository.getReferenceById(it) }
            ?: organizationRepository.findByName(organization.name)
            ?: organizationRepository.saveAndFlush(
                Organization(name = organization.name, moderated = false, creationTime = now())
            )
    }
}
