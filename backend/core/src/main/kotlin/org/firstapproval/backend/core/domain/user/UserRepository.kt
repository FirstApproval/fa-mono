package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(email: String?): User?
    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
    fun findByEmailAndPasswordIsNull(email: String): User?
}
