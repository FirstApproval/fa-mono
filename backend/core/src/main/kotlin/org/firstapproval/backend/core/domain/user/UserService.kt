package org.firstapproval.backend.core.domain.user

import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.user.OauthType.FACEBOOK
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
import java.util.UUID.randomUUID
import java.util.function.Supplier

@Service
class UserService(
    private val userRepository: UserRepository,
) {

    @Transactional(isolation = REPEATABLE_READ)
    fun saveOrUpdate(oauthUser: OauthUser): User {
        val userSupplier = when (oauthUser.type) {
            GOOGLE -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByGoogleIdOrEmail(oauthUser.externalId, oauthUser.email)
                } else {
                    userRepository.findByGoogleId(oauthUser.externalId)
                }
            }

            FACEBOOK -> Supplier<User?> {
                if (oauthUser.email != null) {
                    userRepository.findByFacebookIdOrEmail(oauthUser.externalId, oauthUser.email)
                } else {
                    userRepository.findByFacebookId(oauthUser.externalId)
                }
            }
        }

        return saveOrUpdateUser(userSupplier, oauthUser)
    }

    @Transactional
    fun get(id: UUID): User {
        return userRepository.findById(id).orElseThrow()
    }

    private fun saveOrUpdateUser(findUserFunc: Supplier<User?>, oauthUser: OauthUser): User {
        val user = findUserFunc.get()
        if (user != null) {
            user.email = oauthUser.email
            user.firstName = oauthUser.firstName
            user.lastName = oauthUser.lastName
            user.middleName = oauthUser.middleName
            user.fullName = oauthUser.fullName

            when (oauthUser.type) {
                GOOGLE -> user.googleId = oauthUser.externalId
                FACEBOOK -> user.facebookId = oauthUser.externalId
            }

            return user
        }

        val userByUsername = userRepository.findByUsername(oauthUser.username)
        val id = randomUUID()
        return userRepository.save(
            User(
                id = id,
                username = if (userByUsername != null) id.toString() else oauthUser.username,
                googleId = if (oauthUser.type == GOOGLE) oauthUser.externalId else null,
                facebookId = if (oauthUser.type == FACEBOOK) oauthUser.externalId else null,
                email = oauthUser.email,
                firstName = oauthUser.firstName,
                lastName = oauthUser.lastName,
                middleName = oauthUser.middleName,
                fullName = oauthUser.fullName
            )
        )
    }
}

enum class OauthType {
    GOOGLE,
    FACEBOOK
}
