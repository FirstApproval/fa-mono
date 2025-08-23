package org.firstapproval.backend.core.domain.link

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface LinkMappingRepository : JpaRepository<LinkMapping, Long> {
    @Cacheable("linkMappings")
    @Query("SELECT l FROM LinkMapping l WHERE l.alias = :alias AND l.expirationTime > CURRENT_TIMESTAMP")
    fun findValidByAlias(alias: String): LinkMapping
}
