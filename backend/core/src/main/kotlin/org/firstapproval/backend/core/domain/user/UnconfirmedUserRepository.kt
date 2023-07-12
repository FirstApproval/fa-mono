package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UnconfirmedUserRepository : JpaRepository<UnconfirmedUser, UUID> {
}
