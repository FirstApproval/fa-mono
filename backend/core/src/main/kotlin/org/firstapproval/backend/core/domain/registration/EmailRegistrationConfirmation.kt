package org.firstapproval.backend.core.domain.registration

import jakarta.persistence.*
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now

private const val SEQUENCE_NAME = "email_registration_confirmations_test_id_seq"

@Entity
@Table(name = "email_registration_confirmations")
class EmailRegistrationConfirmation(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = SEQUENCE_NAME)
    @SequenceGenerator(name = SEQUENCE_NAME, sequenceName = SEQUENCE_NAME)
    var id: Long = 0,
    val email: String,
    val code: String,
    var creationTime: ZonedDateTime = now()
)