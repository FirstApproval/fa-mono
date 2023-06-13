package org.firstapproval.backend.core.domain.registration

import org.springframework.data.jpa.repository.JpaRepository

interface EmailRegistrationConfirmationRepository: JpaRepository<EmailRegistrationConfirmation, Long> {
}