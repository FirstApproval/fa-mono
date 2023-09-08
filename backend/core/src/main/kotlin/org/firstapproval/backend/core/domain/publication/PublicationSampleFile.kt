package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
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
    @Convert(converter = StringEncryptionConverter::class)
    var description: String? = null,
    var dirPath: String,
    val isDir: Boolean,
    val size: Long? = null,
    var hash: String? = null,
    var creationTime: ZonedDateTime = now()
) {
    val name get() = fullPath.substring(fullPath.lastIndexOf('/') + 1)
}
