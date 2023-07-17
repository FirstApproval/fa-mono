package org.firstapproval.backend.core.domain.publication.authors

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ConfirmedAuthorRepository : JpaRepository<ConfirmedAuthor, UUID> {
}
