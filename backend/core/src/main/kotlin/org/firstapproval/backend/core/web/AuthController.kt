package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.AuthorizeRequest
import org.firstapproval.api.server.model.AuthorizeResponse
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.domain.user.OauthType.GOOGLE
import org.firstapproval.backend.core.domain.user.OauthUser
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val jwtService: JwtService, private val userService: UserService) : AuthApi {

    override fun authorize(request: AuthorizeRequest): ResponseEntity<AuthorizeResponse> {
        // TODO change code for id_token and generate our internal token
        val user = userService.saveOrUpdate(OauthUser("123", null, GOOGLE)) // MOCK
        val token = jwtService.generate(mapOf("sub" to user.id))
        return ok(AuthorizeResponse().token(token))
    }
}
