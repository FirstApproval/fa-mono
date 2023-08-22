package org.firstapproval.backend.core.domain.publication.authors

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UnconfirmedAuthorRepository : JpaRepository<UnconfirmedAuthor, UUID> {
    fun findByEmail(email: String?): List<UnconfirmedAuthor>
}
