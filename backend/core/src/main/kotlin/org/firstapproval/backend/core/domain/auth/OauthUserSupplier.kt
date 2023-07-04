package org.firstapproval.backend.core.domain.auth

import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.config.DEFAULT_REST_TEMPLATE
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.config.Properties.OauthProperties.OauthProviderProperties
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.utils.require
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpMethod.POST
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

abstract class OauthUserSupplier {
    @Autowired
    @Qualifier(DEFAULT_REST_TEMPLATE)
    lateinit var restTemplate: RestTemplate

    @Autowired
    lateinit var oauthProperties: OauthProperties

    @Autowired
    lateinit var jwtService: JwtService

    abstract var oauthType: OauthType

    abstract fun getOauthUser(code: String): OauthUser

    protected inline fun <reified T : Any> exchangeTokenForResources(resourceUrl: String, accessToken: String): T {
        val headers = HttpHeaders()
        headers.setBearerAuth(accessToken)
        return restTemplate.exchange(resourceUrl, GET, HttpEntity(null, headers), T::class.java).body.require()
    }

    protected inline fun <reified T : Any> exchangeForTokens(
        code: String,
        oauthProviderProperties: OauthProviderProperties,
        method: HttpMethod = POST
    ): T =
        restTemplate.exchange(
            getOauthUri(code, oauthProviderProperties), method, null, T::
            class.java
        ).body.require()

    protected fun getOauthUri(
        code: String,
        oauthProviderProperties: OauthProviderProperties
    ) =
        UriComponentsBuilder.fromHttpUrl(oauthProviderProperties.tokenUrl)
            .queryParam("grant_type", "authorization_code")
            .queryParam("code", code)
            .queryParam("redirect_uri", oauthProviderProperties.redirectUri)
            .queryParam("client_id", oauthProviderProperties.clientId)
            .queryParam("client_secret", oauthProviderProperties.clientSecret)
            .build().toUriString()
}

data class TokensResponse(@JsonProperty("access_token") val accessToken: String, @JsonProperty("id_token") val idToken: String)
data class AccessTokenResponse(@JsonProperty("access_token") val accessToken: String)

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
