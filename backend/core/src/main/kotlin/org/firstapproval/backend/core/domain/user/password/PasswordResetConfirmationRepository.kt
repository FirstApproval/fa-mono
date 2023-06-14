package org.firstapproval.backend.core.domain.user.password

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime
import java.util.*

interface PasswordResetConfirmationRepository: JpaRepository<PasswordResetConfirmation, UUID> {

    fun deleteByCreationTimeBefore(date: ZonedDateTime)
}