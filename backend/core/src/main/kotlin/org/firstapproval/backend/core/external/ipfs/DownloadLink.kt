package org.firstapproval.backend.core.external.ipfs

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now

@Entity
@Table(name = "download_links")
class DownloadLink(
    @Id
    var publicationId: String,
    var url: String? = null,
    var expirationTime: ZonedDateTime? = null,
    var creationTime: ZonedDateTime = now(),
)
