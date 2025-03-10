package org.firstapproval.backend.core.domain.auth

import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.domain.user.OauthType.FACEBOOK
import org.springframework.stereotype.Component
import org.springframework.web.client.postForObject
import org.springframework.web.util.UriComponentsBuilder

@Component
class FacebookOauthUserSupplier(oauthProperties: OauthProperties) : OauthUserSupplier(oauthProperties) {
    override var oauthType = FACEBOOK

    override fun getOauthUser(code: String): OauthUser {
        val oauthTokenResponse = exchangeForTokens<AccessTokenResponse>(code, oauthProperties.facebook)
        val userData = restTemplate.postForObject<FacebookOauthUserData>(
            UriComponentsBuilder.fromHttpUrl(oauthProperties.facebook.dataUrl)
                .queryParam("fields", "email")
                .queryParam("access_token", oauthTokenResponse.accessToken)
                .build().toUriString()
        )
        return OauthUser(userData.id, userData.email, userData.email?.split("@")?.first() ?: userData.id, FACEBOOK)
    }
}

data class FacebookOauthUserData(
    val id: String,
    val email: String?
)
