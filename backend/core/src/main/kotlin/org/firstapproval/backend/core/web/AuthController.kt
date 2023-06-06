package org.firstapproval.backend.core.web

import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.firstapproval.api.server.AuthApi
import org.firstapproval.api.server.model.AuthorizeRequest
import org.firstapproval.api.server.model.AuthorizeResponse

@RestController
class AuthController: AuthApi {

    override fun authorize(request: AuthorizeRequest): ResponseEntity<AuthorizeResponse> {
        return ok(AuthorizeResponse().token(""))
    }
}
