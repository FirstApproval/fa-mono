package org.firstapproval.backend.core.domain.user.registration

import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "email_registration_confirmations")
class EmailRegistrationConfirmation(
    @Id
    var id: UUID,
    @Convert(converter = StringEncryptionConverter::class)
    val email: String,
    var firstName: String,
    var lastName: String,
    var password: String,
    var code: String,
    var attemptCount: Int = 1,
    var utmSource: String? = null,
    var initialReferrer: String? = null,
    var lastTryTime: ZonedDateTime? = now(),
    var creationTime: ZonedDateTime = now()
)
