package org.firstapproval.backend.core.domain.user

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "unconfirmed_users")
class UnconfirmedUser(
    @Id
    var id: UUID,
    var email: String? = null,
    var fullName: String? = null,
    var shortBio: String? = null
)
