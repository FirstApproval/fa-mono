package org.firstapproval.backend.core.domain.user.limits

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "authorization_limits")
class AuthorizationLimit(
    @Id
    var id: UUID,
    var email: String,
    var count: Int = 1,
    var creationTime: ZonedDateTime = now(),
)