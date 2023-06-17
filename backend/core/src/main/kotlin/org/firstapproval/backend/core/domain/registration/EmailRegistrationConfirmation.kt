package org.firstapproval.backend.core.domain.registration

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

private const val SEQUENCE_NAME = "email_registration_confirmations_test_id_seq"

@Entity
@Table(name = "email_registration_confirmations")
class EmailRegistrationConfirmation(
    @Id
    var id: UUID,
    val email: String,
    var firstName: String?,
    var lastName: String?,
    var password: String,
    val code: String,
    var attemptCount: Int = 1,
    var lastTryTime:  ZonedDateTime? = now(),
    var creationTime: ZonedDateTime = now()
)