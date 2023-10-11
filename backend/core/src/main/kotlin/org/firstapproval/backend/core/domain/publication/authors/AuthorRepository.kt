package org.firstapproval.backend.core.domain.publication.authors

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AuthorRepository : JpaRepository<Author, UUID> {
    fun findAllByUserId(userId: UUID): List<Author>
    fun findByEmailAndIsConfirmedFalse(email: String): List<Author>
}
