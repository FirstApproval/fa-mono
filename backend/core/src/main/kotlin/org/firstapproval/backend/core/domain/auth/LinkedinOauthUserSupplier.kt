package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.domain.user.OauthType.LINKEDIN
import org.springframework.http.HttpMethod.GET
import org.springframework.stereotype.Component

@Component
class LinkedinOauthUserSupplier : OauthUserSupplier() {
    override fun getOauthType(): OauthType = LINKEDIN

    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<AccessTokenResponse>(code, oauthProperties.linkedin, GET)
        val userData = exchangeTokenForResources<LinkedInProfile>(oauthProperties.linkedin.dataUrl, tokens.accessToken)
        val emailData = exchangeTokenForResources<LinkedInEmailResponse>(oauthProperties.linkedin.dataUrl2, tokens.accessToken)
        val email = emailData.elements[0].handle.emailAddress
        return OauthUser(
            externalId = userData.id,
            email = email,
            username = email.split("@").first(),
            type = LINKEDIN,
            firstName = userData.localizedFirstName,
            lastName = userData.localizedLastName,
        )
    }
}

data class LinkedInProfile(
    val localizedLastName: String,
    val localizedFirstName: String,
    val id: String
)

data class LinkedInEmailResponse(val elements: List<LinkedInEmailElement>)

data class LinkedInEmailElement(@JsonProperty("handle~") val handle: LinkedInEmailHolder)

data class LinkedInEmailHolder(val emailAddress: String)

