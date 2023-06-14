package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {

    fun findByGoogleId(googleId: String): User?
    fun findByGoogleIdOrEmail(googleId: String, email: String?): User?
    fun findByOrcidId(orcidId: String): User?
    fun findByOrcidIdOrEmail(orcidId: String, email: String?): User?
    fun findByEmail(email: String): User
}
