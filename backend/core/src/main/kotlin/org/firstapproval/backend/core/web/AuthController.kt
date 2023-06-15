package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.AuthorizationLinksResponse
import org.firstapproval.api.server.model.AuthorizeRequest
import org.firstapproval.api.server.model.AuthorizeResponse
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.user.OauthType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val oauthProperties: OauthProperties,
    private val tokenService: TokenService
) : AuthApi {

    override fun authorize(request: AuthorizeRequest): ResponseEntity<AuthorizeResponse> {
        val token = tokenService.exchangeOauthToken(request.code, OauthType.valueOf(request.type.toString()))
        return ok(AuthorizeResponse().token(token))
    }

    override fun authorizationLinks(): ResponseEntity<AuthorizationLinksResponse> {
        return ok(AuthorizationLinksResponse().google(oauthProperties.google.authUrl))
    }
}
