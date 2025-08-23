package org.firstapproval.backend.core.domain.link

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.util.*

@Entity
@Table(name = "link_mappings")
class LinkMapping(
    @Id
    val id: UUID = UUID.randomUUID(),
    val alias: String,
    val url: String,
    val creationTime: ZonedDateTime,
    val expirationTime: ZonedDateTime,
)
