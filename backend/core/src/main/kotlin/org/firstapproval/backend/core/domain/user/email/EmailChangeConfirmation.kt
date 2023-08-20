package org.firstapproval.backend.core.domain.user.email

import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.config.encryption.StringEncryptionConverter
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.util.*

@Entity
@Table(name = "email_change_confirmations")
class EmailChangeConfirmation(
    @Id
    var id: UUID,
    @OneToOne
    var user: User,
    @Convert(converter = StringEncryptionConverter::class)
    val email: String,
    val code: String,
    var creationTime: ZonedDateTime = ZonedDateTime.now()
)
