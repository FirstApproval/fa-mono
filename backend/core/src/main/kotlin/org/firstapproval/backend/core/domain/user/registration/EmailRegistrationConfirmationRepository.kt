package org.firstapproval.backend.core.domain.user.registration

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime
import java.util.*

interface EmailRegistrationConfirmationRepository: JpaRepository<EmailRegistrationConfirmation, UUID> {

    fun deleteByCreationTimeBefore(date: ZonedDateTime)

    fun findByEmail(email: String): EmailRegistrationConfirmation?

    fun findByLastTryTimeNotNullAndLastTryTimeBefore(date: ZonedDateTime): List<EmailRegistrationConfirmation>
}
