package org.firstapproval.backend.core.domain.visitor

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID


@Entity
@Table(name = "visitors")
class Visitor(
    @Id
    var id: UUID = randomUUID(),
    var ip: String? = null,
    var utmSource: String? = null,
    var initialReferrer: String? = null,
    var creationTime: ZonedDateTime = now(),
)
