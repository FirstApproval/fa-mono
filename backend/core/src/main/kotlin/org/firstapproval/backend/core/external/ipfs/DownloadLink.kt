package org.firstapproval.backend.core.external.ipfs

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID

@Entity
@Table(name = "download_links")
class DownloadLink (
    @Id
    var publicationId: UUID,
    var url: String,
    var expirationTime: ZonedDateTime,
    var creationTime: ZonedDateTime = now(),
)
