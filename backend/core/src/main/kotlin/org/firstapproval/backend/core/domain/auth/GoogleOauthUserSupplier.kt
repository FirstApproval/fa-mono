package org.firstapproval.backend.core.domain.auth

import com.auth0.jwk.UrlJwkProvider
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.config.security.InvalidTokenException
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.springframework.stereotype.Component
import java.net.URL

@Component
class GoogleOauthUserSupplier(oauthProperties: OauthProperties) : OauthUserSupplier(oauthProperties) {
    override var oauthType = GOOGLE

    private var publicKeys = UrlJwkProvider(URL(oauthProperties.google.certsUrl)).all.map { it.publicKey }

    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<TokensResponse>(code, oauthProperties.google)
        val claims = parseOauthToken(tokens.idToken)
        val email = claims["email"] as String
        val profileResource = exchangeTokenForResources<GoogleProfile>(oauthProperties.google.dataUrl, tokens.accessToken)
        return OauthUser(
            externalId = claims["sub"] as String,
            email = email,
            username = email.split("@").first(),
            type = GOOGLE,
            firstName = profileResource.given_name,
            lastName = profileResource.family_name,
            fullName = profileResource.name,
        )
    }

    private fun parseOauthToken(token: String): Claims {
        return runCatching { parseToken(token) }
            .getOrElse {
                fetchKeysFromGoogle()
                parseToken(token)
            }
    }

    private fun parseToken(token: String): Claims {
        this.publicKeys.forEach { key ->
            try {
                return Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .body
            } catch (_: JwtException) {
                // Ignore exception
            }
        }
        throw InvalidTokenException()
    }

    private fun fetchKeysFromGoogle() {
        this.publicKeys = UrlJwkProvider(URL(oauthProperties.google.certsUrl)).all.map { it.publicKey }
    }
}

data class GoogleProfile(
    val sub: String,
    val name: String,
    val given_name: String,
    val family_name: String?,
    val picture: String,
    val locale: String?
)
