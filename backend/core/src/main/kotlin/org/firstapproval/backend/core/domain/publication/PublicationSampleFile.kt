package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "publication_sample_files")
class PublicationSampleFile(
    @Id
    var id: UUID,
    @ManyToOne
    var publication: Publication,
    var fullPath: String,
    var description: String? = null,
    var dirPath: String,
    val isDir: Boolean,
    var creationTime: ZonedDateTime = now()
) {
    val name get() = fullPath.substring(fullPath.lastIndexOf('/') + 1)
}
