package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "publication_files")
class PublicationFile(
    @Id
    var id: UUID,
    var publicationId: UUID,
    var name: String,
    var fullPath: String,
    var dirPath: String
)
