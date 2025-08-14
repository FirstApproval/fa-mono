package org.firstapproval.backend.core.domain.subscribers

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime

@Entity
@Table(name = "subscribers")
class Subscriber(
    @Id
    val email: String,
    val creationTime: ZonedDateTime = ZonedDateTime.now(),
)
