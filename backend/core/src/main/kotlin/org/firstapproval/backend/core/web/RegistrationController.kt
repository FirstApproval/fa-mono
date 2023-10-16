package org.firstapproval.backend.core.web

import org.firstapproval.api.server.RegistrationApi
import org.firstapproval.api.server.model.AuthorizeResponse
import org.firstapproval.api.server.model.RegistrationRequest
import org.firstapproval.api.server.model.RegistrationResponse
import org.firstapproval.api.server.model.SubmitRegistrationRequest
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class RegistrationController(
    private val tokenService: TokenService,
    private val userService: UserService
) : RegistrationApi {
    override fun startRegistration(registrationRequest: RegistrationRequest): ResponseEntity<RegistrationResponse> {
        val registrationToken = userService.startUserRegistration(registrationRequest)
        return ok().body(RegistrationResponse(registrationToken))
    }

    override fun confirmRegistration(submitRegistrationRequest: SubmitRegistrationRequest): ResponseEntity<AuthorizeResponse> {
        val user = userService.finishRegistration(submitRegistrationRequest.registrationToken, submitRegistrationRequest.code)
        val token = tokenService.generateForUser(user.id.toString(), user.username, user.password)
        return ok(AuthorizeResponse().token(token))
    }
}
