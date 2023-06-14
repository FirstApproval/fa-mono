package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthUser
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val jwtService: JwtService, private val userService: UserService) : AuthApi {

    override fun authorizeOauth(request: AuthorizeOauthRequest): ResponseEntity<AuthorizeResponse> {
        // TODO change code for id_token and generate our internal token
        val user = userService.saveOrUpdate(OauthUser("123", null, GOOGLE)) // MOCK
        val token = jwtService.generate(mapOf("sub" to user.id))
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

}
