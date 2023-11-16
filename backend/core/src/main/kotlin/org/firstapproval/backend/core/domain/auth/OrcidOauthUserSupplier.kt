package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
import com.fasterxml.jackson.databind.ObjectMapper
import org.firstapproval.backend.core.domain.user.OauthType.ORCID
import org.springframework.stereotype.Component

@Component
class OrcidOauthUserSupplier : OauthUserSupplier() {
    override var oauthType = ORCID

    override fun getOauthUser(code: String): OauthUser {
        val tokens = exchangeForTokens<OrcidTokenResponse>(code, oauthProperties.orcid)
        val userData =
            exchangeTokenForResources<String>("${oauthProperties.orcid.dataUrl}/${tokens.orcidId}/person", tokens.accessToken)
        val profile = ObjectMapper()
            .configure(FAIL_ON_UNKNOWN_PROPERTIES, false)
            .readValue(userData, OrcidProfile::class.java)
        val email = profile.emails.email.firstOrNull { it.primary && it.verified }?.email
        return OauthUser(
            externalId = tokens.orcidId,
            email = email,
            username = email?.split("@")?.firstOrNull() ?: tokens.orcidId,
            type = ORCID,
            firstName = profile.names.givenName.value,
            lastName = profile.names.familyName.value,
        )
    }
}

class OrcidTokenResponse(
    @JsonProperty("access_token") val accessToken: String,
    @JsonProperty("token_type") val tokenType: String,
    @JsonProperty("refresh_token") val refreshToken: String,
    @JsonProperty("expires_in") val expiresIn: String,
    @JsonProperty("scope") val scope: String,
    @JsonProperty("name") val name: String,
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

data class ValueHolder(
    @JsonProperty("value") val value: String
)

data class OrcidEmailsHolder(
    @JsonProperty("email") val email: List<OrcidEmailHolder>
)

data class OrcidEmailHolder(
    @JsonProperty("email") val email: String,
    @JsonProperty("primary") val primary: Boolean,
    @JsonProperty("verified") val verified: Boolean
)
