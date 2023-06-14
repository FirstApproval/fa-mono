package org.firstapproval.backend.core.domain.user.limits

import org.springframework.data.jpa.repository.JpaRepository
import java.time.ZonedDateTime
import java.util.*

interface AuthorizationLimitRepository: JpaRepository<AuthorizationLimit, UUID> {
    fun findByEmail(email: String): AuthorizationLimit?

    fun deleteByCreationTimeBefore(date: ZonedDateTime)
}