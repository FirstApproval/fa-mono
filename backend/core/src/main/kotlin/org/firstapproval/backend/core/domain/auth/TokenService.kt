package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.config.DEFAULT_REST_TEMPLATE
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.config.security.AuthToken
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.domain.user.OauthType.FACEBOOK
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.utils.require
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.GET
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.postForObject
import org.springframework.web.util.UriComponentsBuilder
import java.util.UUID.fromString

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
        }
        val user = userService.saveOrUpdate(oauthUser)
        return jwtService.generate(
            mapOf(
                "sub" to user.id,
                "userInfo" to mapOf(
                    "username" to user.username,
                    "email" to user.email
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
