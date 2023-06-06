package org.firstapproval.backend.core.domain.user

import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthType.ORCID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import java.util.*
import java.util.UUID.*

@Service
class UserService(
    private val userRepository: UserRepository,
) {

    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        return when (oauthUser.type) {
            GOOGLE -> saveOrUpdateGoogleUser(oauthUser)
            ORCID -> saveOrUpdateOrcidUser(oauthUser)
        }
    }

    @Transactional
    fun get(id: UUID): User {
        return userRepository.findById(id).orElseThrow()
    }

    private fun saveOrUpdateGoogleUser(oauthUser: OauthUser): User {
        val user = if (oauthUser.email != null) {
            userRepository.findByGoogleIdOrEmail(oauthUser.externalId, oauthUser.email)
        } else {
            userRepository.findByGoogleId(oauthUser.externalId)
        }
        if (user != null) {
            user.email = oauthUser.email
            user.googleId = oauthUser.externalId
            return user
        }
        return userRepository.save(
            User(
                id = randomUUID(),
                googleId = oauthUser.externalId,
                email = oauthUser.email,
            )
        )
    }

    private fun saveOrUpdateOrcidUser(oauthUser: OauthUser): User {
        val user = if (oauthUser.email != null) {
            userRepository.findByOrcidIdOrEmail(oauthUser.externalId, oauthUser.email)
        } else {
            userRepository.findByOrcidId(oauthUser.externalId)
        }
        if (user != null) {
            user.email = oauthUser.email
            user.orcidId = oauthUser.externalId
            return user
        }
        return userRepository.save(
            User(
                id = randomUUID(),
                orcidId = oauthUser.externalId,
                email = oauthUser.email,
            )
        )
    }
}

data class OauthUser(
    val externalId: String,
    val email: String?,
    val type: OauthType
)

enum class OauthType {
    GOOGLE,
    ORCID
}