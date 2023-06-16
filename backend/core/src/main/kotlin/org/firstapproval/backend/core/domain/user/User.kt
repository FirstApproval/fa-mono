package org.firstapproval.backend.core.domain.user

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "users")
class User(
    @Id
    var id: UUID,
    var googleId: String? = null,
    var orcidId: String? = null,
    var email: String? = null,
    var password: String? = null,
    var firstName: String? = null,
    var lastName: String? = null,
    var creationTime: ZonedDateTime = now(),
)
