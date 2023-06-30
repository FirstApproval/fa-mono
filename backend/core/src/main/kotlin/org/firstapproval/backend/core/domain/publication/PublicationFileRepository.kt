package org.firstapproval.backend.core.domain.publication

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface PublicationFileRepository : JpaRepository<PublicationFile, UUID> {
}
