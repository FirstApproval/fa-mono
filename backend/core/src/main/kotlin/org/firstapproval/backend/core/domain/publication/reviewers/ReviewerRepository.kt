package org.firstapproval.backend.core.domain.publication.reviewers

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ReviewerRepository : JpaRepository<Reviewer, UUID>
