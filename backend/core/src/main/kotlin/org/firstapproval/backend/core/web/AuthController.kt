package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.AuthorizationLinksResponse
import org.firstapproval.api.server.model.AuthorizeRequest
import org.firstapproval.api.server.model.AuthorizeResponse
import org.firstapproval.backend.core.config.Properties.OauthProperties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.user.OauthType
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthUser
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val oauthProperties: OauthProperties,
    private val tokenService: TokenService
) : AuthApi {

    override fun authorizeOauth(request: AuthorizeOauthRequest): ResponseEntity<AuthorizeResponse> {
        val token = tokenService.exchangeOauthToken(request.code, OauthType.valueOf(request.type.toString()))
        return ok(AuthorizeResponse().token(token))
    }

    override fun authorize(authorizeRequest: AuthorizeRequest): ResponseEntity<AuthorizeResponse> {
        val user = userService.checkUserEmailPassword(authorizeRequest.email, authorizeRequest.password) ?: return ok(AuthorizeResponse())
        val token = jwtService.generate(mapOf("sub" to user.id))
        return ok(AuthorizeResponse().token(token))
    }

    override fun startRegistration(registrationRequest: RegistrationRequest): ResponseEntity<RegistrationResponse> {
        val registrationToken = userService.startUserRegistration(registrationRequest.email, registrationRequest.password)
        return ok().body(RegistrationResponse(registrationToken))
    }

    override fun confirmRegistration(submitRegistrationRequest: SubmitRegistrationRequest): ResponseEntity<AuthorizeResponse> {
        val user = userService.finishRegistration(submitRegistrationRequest.registrationToken, submitRegistrationRequest.code)
        val token = jwtService.generate(mapOf("sub" to user.id))
        return ok(AuthorizeResponse().token(token))
    }

    override fun authorizationLinks(): ResponseEntity<AuthorizationLinksResponse> {
        return ok(AuthorizationLinksResponse().google(oauthProperties.google.authUrl))
    }
}
