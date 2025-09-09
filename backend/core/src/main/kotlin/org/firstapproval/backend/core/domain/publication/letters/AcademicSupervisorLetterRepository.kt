package org.firstapproval.backend.core.domain.publication.letters

import org.firstapproval.backend.core.domain.publication.Publication
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import java.util.UUID

interface AcademicSupervisorLetterRepository : JpaRepository<AcademicSupervisorLetter, UUID> {
    fun findAllByPublication(publication: Publication): List<AcademicSupervisorLetter>
    @Modifying
    fun deleteByIdAndPublicationId(id: UUID, publicationId: String)
}
