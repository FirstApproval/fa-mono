package org.firstapproval.backend.core.domain.auth

import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.springframework.stereotype.Component

@Component
class GoogleOauthUserSupplier : OauthUserSupplier() {
    override var oauthType = GOOGLE

    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<TokensResponse>(code, oauthProperties.google)
        val claims = jwtService.parseGoogle(tokens.idToken)
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
}

data class GoogleProfile(
    val sub: String,
    val name: String,
    val given_name: String,
    val family_name: String?,
    val picture: String,
    val locale: String?
)
