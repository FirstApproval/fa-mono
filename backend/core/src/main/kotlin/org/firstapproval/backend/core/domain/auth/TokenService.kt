package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.config.DEFAULT_REST_TEMPLATE
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.config.security.AuthToken
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.domain.user.OauthType.*
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.utils.require
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.GET
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject
import org.springframework.web.client.postForObject
import org.springframework.web.util.UriComponentsBuilder
import java.util.UUID.*

@Service
class TokenService(
    private val oauthProperties: OauthProperties,
    @Qualifier(DEFAULT_REST_TEMPLATE) val restTemplate: RestTemplate,
    private val userService: UserService,
    private val jwtService: JwtService
) {

    fun exchangeOauthToken(code: String, type: OauthType): String {
        val oauthUser = when (type) {
            GOOGLE -> getGoogleUser(code)
            FACEBOOK -> getFacebookUser(code)
            LINKEDIN -> getLinkedinUser(code)
            ORCID -> getOrcidUser(code)
        }
        val user = userService.saveOrUpdate(oauthUser)
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

    private fun getGoogleUser(code: String): OauthUser {
        val tokens = restTemplate.postForObject<TokensResponse>(
            getOauthUri(
                code = code,
                tokenUrl = oauthProperties.google.tokenUrl,
                redirectUri = oauthProperties.google.redirectUri,
                clientId = oauthProperties.google.clientId,
                clientSecret = oauthProperties.google.clientSecret,
            ), null
        ).require()
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

    private fun getFacebookUser(code: String): OauthUser {
        val oauthTokenResponse = restTemplate.postForObject<OauthAccessTokenResponse>(
            getOauthUri(
                code,
                oauthProperties.facebook.tokenUrl,
                oauthProperties.facebook.redirectUri,
                oauthProperties.facebook.clientId,
                oauthProperties.facebook.clientSecret
            ), null
        ).require()
        val userData = restTemplate.postForObject<FacebookOauthUserData>(
            UriComponentsBuilder.fromHttpUrl(oauthProperties.facebook.dataUrl)
                .queryParam("fields", "email")
                .queryParam("access_token", oauthTokenResponse.accessToken)
                .build().toUriString()
        )
        return OauthUser(userData.id, userData.email, userData.email?.split("@")?.first() ?: userData.id, FACEBOOK)
    }

    private fun getLinkedinUser(code: String): OauthUser {
        val tokens = restTemplate.getForObject<OauthAccessTokenResponse>(
            getOauthUri(
                code = code,
                tokenUrl = oauthProperties.linkedin.tokenUrl,
                redirectUri = oauthProperties.linkedin.redirectUri,
                clientId = oauthProperties.linkedin.clientId,
                clientSecret = oauthProperties.linkedin.clientSecret,
            )
        ).require()
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

    private fun getOrcidUser(code: String): OauthUser {
        val tokens = restTemplate.postForObject<OrcidTokenResponse>(
            getOauthUri(
                code = code,
                tokenUrl = oauthProperties.orcid.tokenUrl,
                redirectUri = oauthProperties.orcid.redirectUri,
                clientId = oauthProperties.orcid.clientId,
                clientSecret = oauthProperties.orcid.clientSecret,
            )
        ).require()
        val userData = exchangeTokenForResources<OrcidProfile>("${oauthProperties.orcid.dataUrl}/${tokens.orcidId}/person", tokens.accessToken)
        val email = userData.emails.email.first { it.primary && it.verified }.email
        return OauthUser(
            externalId = tokens.orcidId,
            email = email,
            username = email.split("@").first(),
            type = ORCID,
            firstName = userData.names.givenName.value,
            lastName = userData.names.familyName.value,
        )
    }

    private inline fun <reified T : Any> exchangeTokenForResources(resourceUrl: String, accessToken: String): T {
        val headers = HttpHeaders()
        headers.setBearerAuth(accessToken)
        return restTemplate.exchange(resourceUrl, GET, HttpEntity(null, headers), T::class.java).body!!
    }

    private fun getOauthUri(
        code: String,
        tokenUrl: String,
        redirectUri: String,
        clientId: String,
        clientSecret: String
    ) =
        UriComponentsBuilder.fromHttpUrl(tokenUrl)
            .queryParam("grant_type", "authorization_code")
            .queryParam("code", code)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("client_id", clientId)
            .queryParam("client_secret", clientSecret)
            .build().toUriString()
}

data class TokensResponse(@JsonProperty("id_token") val idToken: String, @JsonProperty("access_token") val accessToken: String)

data class OauthAccessTokenResponse(@JsonProperty("access_token") val accessToken: String)
data class OrcidTokenResponse(
    @JsonProperty("access_token") val accessToken: String, @JsonProperty("token_type") val tokenType: String,
    @JsonProperty("refresh_token") val refreshToken: String, @JsonProperty("expires_in") val expiresIn: String,
    @JsonProperty("scope") val scope: String, @JsonProperty("name") val name: String,
    @JsonProperty("orcid") val orcidId: String
)

data class OauthUser(
    val externalId: String,
    val email: String?,
    val username: String,
    val type: OauthType,
    val firstName: String? = null,
    val lastName: String? = null,
    val middleName: String? = null,
    val fullName: String? = null,
)

data class FacebookOauthUserData(
    val id: String,
    val email: String?
)

data class GoogleProfile(
    val sub: String,
    val name: String,
    val given_name: String,
    val family_name: String?,
    val picture: String,
    val locale: String
)

data class LinkedInProfile(
    val localizedLastName: String,
    val localizedFirstName: String,
    val id: String
)

data class LinkedInEmailResponse(val elements: List<LinkedInEmailElement>)

data class LinkedInEmailElement(@JsonProperty("handle~") val handle: LinkedInEmailHolder)

data class LinkedInEmailHolder(val emailAddress: String)

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
