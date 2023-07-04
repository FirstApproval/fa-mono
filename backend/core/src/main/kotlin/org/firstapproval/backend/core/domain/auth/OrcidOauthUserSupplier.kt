package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.domain.user.OauthType
import org.springframework.stereotype.Component

@Component
class OrcidOauthUserSupplier : OauthUserSupplier() {
    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<OrcidTokenResponse>(code, oauthProperties.orcid)
        val userData =
            exchangeTokenForResources<OrcidProfile>("${oauthProperties.orcid.dataUrl}/${tokens.orcidId}/person", tokens.accessToken)
        val email = userData.emails.email.first { it.primary && it.verified }.email
        return OauthUser(
            externalId = tokens.orcidId,
            email = email,
            username = email.split("@").first(),
            type = OauthType.ORCID,
            firstName = userData.names.givenName.value,
            lastName = userData.names.familyName.value,
        )
    }
}

class OrcidTokenResponse(
    @JsonProperty("access_token") val accessToken: String, @JsonProperty("token_type") val tokenType: String,
    @JsonProperty("refresh_token") val refreshToken: String, @JsonProperty("expires_in") val expiresIn: String,
    @JsonProperty("scope") val scope: String, @JsonProperty("name") val name: String,
    @JsonProperty("orcid") val orcidId: String
)

data class OrcidProfile(
    @JsonProperty("name") val names: OrcidNamesHolder,
    @JsonProperty("emails") val emails: OrcidEmailsHolder,
)

data class OrcidNamesHolder(
    @JsonProperty("given-names") val givenName: ValueHolder,
    @JsonProperty("family-name") val familyName: ValueHolder
)

data class ValueHolder(val value: String)

data class OrcidEmailsHolder(val email: List<OrcidEmailHolder>)
data class OrcidEmailHolder(val email: String, val primary: Boolean, val verified: Boolean)
