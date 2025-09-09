package org.firstapproval.backend.core.domain.publication.letters

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID

@Entity
@Table(name = "academic_supervisor_letters")
class AcademicSupervisorLetter(
    @Id
    var id: UUID,
    @ManyToOne
    val publication: Publication,
    val fileName: String,
    val contentLength: Long,
    val academicSupervisorName: String,
    val creationTime: ZonedDateTime = now()
)

fun AcademicSupervisorLetter.toApiObject() = org.firstapproval.api.server.model.AcademicSupervisorLetter(
).also {
    it.id = id
    it.fileName = fileName
    it.contentLength = contentLength
    it.academicSupervisorName = academicSupervisorName
}
