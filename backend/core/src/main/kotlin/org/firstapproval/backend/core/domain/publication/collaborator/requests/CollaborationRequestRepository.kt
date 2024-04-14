package org.firstapproval.backend.core.domain.publication.collaborator.requests

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CollaborationRequestRepository : JpaRepository<CollaborationRequest, UUID>
