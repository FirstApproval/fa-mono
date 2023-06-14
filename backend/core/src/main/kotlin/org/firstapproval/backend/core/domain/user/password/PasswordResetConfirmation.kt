package org.firstapproval.backend.core.domain.user.password

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
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
    @ManyToOne
    var user: User,
    var creationTime: ZonedDateTime = now(),
)