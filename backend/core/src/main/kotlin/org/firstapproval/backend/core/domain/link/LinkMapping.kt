package org.firstapproval.backend.core.domain.link

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.firstapproval.api.server.model.LinkMapping as LinkMappingApiObject
import java.time.ZonedDateTime
import java.util.*

@Entity
@Table(name = "link_mappings")
class LinkMapping(
    @Id
    val id: UUID = UUID.randomUUID(),
    val alias: String,
    val url: String,
    val eventTime: ZonedDateTime?,
    val description: String?,
    val creationTime: ZonedDateTime,
    val expirationTime: ZonedDateTime,
)

fun LinkMapping.toApiObject() = LinkMappingApiObject(
    url
).also {
    it.description = description
    it.eventTime = eventTime?.toOffsetDateTime()
}
