package org.firstapproval.backend.core.domain.user.email

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime
import java.util.UUID

interface EmailChangeConfirmationRepository : JpaRepository<EmailChangeConfirmation, UUID> {
    fun deleteByCreationTimeBefore(date: ZonedDateTime)
    fun deleteByUserId(userId: UUID)
}
