package org.firstapproval.backend.core.web

import org.firstapproval.api.server.OrganizationApi
import org.firstapproval.api.server.model.Organization
import org.firstapproval.api.server.model.SearchOrganizationsResponse
import org.firstapproval.backend.core.domain.organizations.OrganizationRepository
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

val PAGEABLE = PageRequest.of(0, 20)

@RestController
class OrganizationController(private val organizationRepository: OrganizationRepository) : OrganizationApi {
    override fun searchOrganizations(text: String): ResponseEntity<SearchOrganizationsResponse> {
        val organizations = organizationRepository.findByName(text, PAGEABLE).map { it.toApiObject() }
        return ok(SearchOrganizationsResponse(organizations))
    }

    override fun getOrganization(id: Long): ResponseEntity<Organization> {
        val organization = organizationRepository.getReferenceById(id).toApiObject()
        return ok(organization)
    }
}
