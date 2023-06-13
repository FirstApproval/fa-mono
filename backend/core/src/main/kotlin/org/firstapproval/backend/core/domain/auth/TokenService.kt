package org.firstapproval.backend.core.domain.auth

import org.firstapproval.backend.core.config.DEFAULT_REST_TEMPLATE
import org.firstapproval.backend.core.config.security.AuthToken
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.util.UUID.*

@Service
class TokenService(
    @Qualifier(DEFAULT_REST_TEMPLATE) private val restTemplate: RestTemplate,
    private val jwtService: JwtService
) {
    fun checkAndParseAuthToken(token: String): AuthToken {
        val claims = jwtService.parse(token)
        return AuthToken(fromString(claims.subject.toString()))
    }
}

data class OauthUser(
    val externalId: String,
    val email: String?,
    val username: String,
    val type: OauthType
)
