package org.firstapproval.backend.core.external.ipfs

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime
import java.util.*

interface DownloadLinkRepository : JpaRepository<DownloadLink, UUID> {
    fun findByPublicationIdAndExpirationTimeLessThan(publicationId: String, expirationTime: ZonedDateTime): DownloadLink?
}
