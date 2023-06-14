package org.firstapproval.backend.core.domain.registration

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface EmailRegistrationConfirmationRepository: JpaRepository<EmailRegistrationConfirmation, UUID> {
}