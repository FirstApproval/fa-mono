package org.firstapproval.backend.core.domain.user.password

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "password_reset_confirmations")
class PasswordResetConfirmation (
    @Id
    var id: UUID,
    @OneToOne
    var user: User,
    var attemptCount: Int = 1,
    var lastTryTime: ZonedDateTime? = now(),
    var creationTime: ZonedDateTime = now(),
)