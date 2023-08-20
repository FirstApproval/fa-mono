package org.firstapproval.backend.core.domain.user.limits

import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "authorization_limits")
class AuthorizationLimit(
    @Id
    var id: UUID,
    @Convert(converter = StringEncryptionConverter::class)
    var email: String,
    var count: Int = 1,
    var creationTime: ZonedDateTime = now(),
)
