package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(email: String?): User?
    fun findByEmail(email: String): User?
    fun findByEmailOrLinkedinId(email: String, linkedinId: String): User?
    fun findByEmailOrGoogleId(email: String, googleId: String): User?
    fun findByEmailOrFacebookId(email: String, facebookId: String): User?
    fun findByFacebookId(externalId: String): User?
    fun findByEmailOrOrcidId(email: String, orcidId: String): User?
    fun findByOrcidId(orcidId: String): User?
    fun existsByEmail(email: String): Boolean
    fun findByEmailAndPasswordIsNull(email: String): User?
}
