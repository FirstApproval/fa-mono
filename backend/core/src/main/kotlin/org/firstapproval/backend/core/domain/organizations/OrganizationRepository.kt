package org.firstapproval.backend.core.domain.organizations

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface OrganizationRepository : JpaRepository<Organization, Long> {
    @Query("select o from Organization o where o.name ilike %:query% and o.moderated = true")
    fun findByName(query: String, pageable: Pageable): List<Organization>

    fun findByName(query: String): Organization?
}
