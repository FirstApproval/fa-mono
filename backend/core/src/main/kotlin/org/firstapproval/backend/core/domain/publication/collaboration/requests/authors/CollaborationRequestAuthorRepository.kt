package org.firstapproval.backend.core.domain.publication.collaboration.requests.authors

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationRequestAuthorRepository : JpaRepository<CollaborationRequestAuthor, UUID>
