package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {

    fun findByGoogleId(googleId: String): User?
    fun findByGoogleIdOrEmail(googleId: String, email: String?): User?
    fun findByFacebookId(faceBookId: String): User?
    fun findByFacebookIdOrEmail(faceBookId: String, email: String?): User?
    fun findByUsername(email: String?): User?
}
