package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.AuthorizationLinksResponse
import org.firstapproval.api.server.model.AuthorizeOauthRequest
import org.firstapproval.api.server.model.AuthorizeRequest
import org.firstapproval.api.server.model.AuthorizeResponse
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val oauthProperties: OauthProperties,
    private val tokenService: TokenService,
    private val userService: UserService
) : AuthApi {

    override fun authorizeOauth(request: AuthorizeOauthRequest): ResponseEntity<AuthorizeResponse> {
        val token = tokenService.exchangeOauthToken(
            code = request.code,
            type = OauthType.valueOf(request.type.toString()),
            utmSource = request.utmSource,
            initialReferrer = request.initialReferrer
        )
        return ok(AuthorizeResponse().token(token))
    }

    override fun authorize(authorizeRequest: AuthorizeRequest): ResponseEntity<AuthorizeResponse> {
        val user = userService.checkUserEmailPassword(authorizeRequest.email, authorizeRequest.password) ?: return ok(AuthorizeResponse())
        val token = tokenService.generateForUser(user.id.toString(), user.username, user.password)
        return ok(AuthorizeResponse().token(token))
    }

    override fun authorizationLinks(): ResponseEntity<AuthorizationLinksResponse> {
        return ok(
            AuthorizationLinksResponse()
                .google(oauthProperties.google.authUrl)
                .facebook(oauthProperties.facebook.authUrl)
                .linkedin(oauthProperties.linkedin.authUrl)
                .orcid(oauthProperties.orcid.authUrl)
        )
    }
}
