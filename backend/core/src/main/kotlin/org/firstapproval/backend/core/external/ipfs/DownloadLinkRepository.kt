package org.firstapproval.backend.core.external.ipfs

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime

interface DownloadLinkRepository : JpaRepository<DownloadLink, String> {
    fun findByPublicationIdAndExpirationTimeGreaterThan(publicationId: String, expirationTime: ZonedDateTime): DownloadLink?
}
