package org.firstapproval.backend.core.domain.publication

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface PublicationRepository : JpaRepository<Publication, UUID> {
}
