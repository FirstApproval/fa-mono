package org.firstapproval.backend.core.domain.auth

import org.firstapproval.backend.core.config.security.AuthToken
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.utils.require
import org.springframework.stereotype.Service
import java.util.UUID.fromString

@Service
class TokenService(
    private val oauthUserSuppliers: Map<OauthType, OauthUserSupplier>,
    private val userService: UserService,
    private val jwtService: JwtService,
) {

    fun exchangeOauthToken(code: String, type: OauthType, utmSource: String?, initialReferrer: String?): String {
        val oauthUser = oauthUserSuppliers[type].require().getOauthUser(code)
        val user = userService.oauthSaveOrUpdate(oauthUser, utmSource, initialReferrer)
        return generateForUser(user.id.toString(), oauthUser.username, oauthUser.email)
    }

    fun generateForUser(userId: String, username: String, email: String?): String {
        return jwtService.generate(
            mapOf(
                "sub" to userId,
                "userInfo" to mapOf(
                    "username" to username,
                    "email" to email
                )
            )
        )
    }

    fun checkAndParseAuthToken(token: String): AuthToken {
        val claims = jwtService.parse(token)
        return AuthToken(fromString(claims.subject.toString()))
    }

//    fun generateDownloadPublicationArchiveToken(userId: String, publicationId: String): String {
//        return jwtService.generate(
//            mapOf(
//                "sub" to publicationId,
//                "userId" to userId
//            ),
//            jwtProperties.publicationArchiveTokenTtl
//        )
//    }
//
//    fun parseDownloadPublicationArchiveToken(token: String): Claims {
//        return jwtService.parse(token)
//    }
}
