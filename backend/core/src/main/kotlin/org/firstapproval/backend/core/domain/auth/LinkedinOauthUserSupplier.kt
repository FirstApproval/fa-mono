package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.domain.user.OauthType.LINKEDIN
import org.springframework.http.HttpMethod.GET
import org.springframework.stereotype.Component

@Component
class LinkedinOauthUserSupplier(oauthProperties: OauthProperties) : OauthUserSupplier(oauthProperties) {
    override var oauthType = LINKEDIN

    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<AccessTokenResponse>(code, oauthProperties.linkedin, GET)
        val userData = exchangeTokenForResources<LinkedInProfile>(oauthProperties.linkedin.dataUrl, tokens.accessToken)
        return OauthUser(
            externalId = userData.sub,
            email = userData.email,
            username = userData.email.split("@").first(),
            type = LINKEDIN,
            firstName = userData.givenName,
            lastName = userData.familyName,
        )
    }
}

data class LinkedInProfile(
    @JsonProperty("given_name")
    val givenName: String,
    @JsonProperty("family_name")
    val familyName: String,
    val email: String,
    val sub: String,
)
