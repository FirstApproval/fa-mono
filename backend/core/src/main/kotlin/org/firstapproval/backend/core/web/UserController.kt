package org.firstapproval.backend.core.web

import org.firstapproval.api.server.UserApi
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.email.EmailChangeService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val userService: UserService,
    private val emailChangeService: EmailChangeService,
    private val jwtService: JwtService,
    private val authHolderService: AuthHolderService
) : UserApi {

    override fun requestPasswordReset(requestPasswordResetRequest: RequestPasswordResetRequest): ResponseEntity<Void> {
        userService.requestPasswordReset(requestPasswordResetRequest.email)
        return ok().build()
    }

    override fun resetPassword(passwordResetRequest: PasswordResetRequest): ResponseEntity<AuthorizeResponse> {
        val user = userService.resetPassword(passwordResetRequest.passwordResetRequestId, passwordResetRequest.password)
        val token = jwtService.generate(mapOf("sub" to user.id))
        return ok(AuthorizeResponse().token(token))
    }

    override fun changePassword(passwordChangeRequest: PasswordChangeRequest): ResponseEntity<Void> {
        userService.changePassword(authHolderService.user, passwordChangeRequest.newPassword, passwordChangeRequest.previousPassword)
        return ok().build()
    }

    override fun setPassword(setPasswordRequest: SetPasswordRequest): ResponseEntity<Void> {
        userService.setPassword(authHolderService.user, setPasswordRequest.newPassword)
        return ok().build()
    }

    override fun changeEmail(changeEmailRequest: ChangeEmailRequest): ResponseEntity<ChangeEmailResponse> {
        val confirmationToken = emailChangeService.createChangeEmailRequest(changeEmailRequest.email, authHolderService.user)
        return ok(ChangeEmailResponse(confirmationToken))
    }

    override fun confirmChangeEmail(changeEmailConfirmationRequest: ChangeEmailConfirmationRequest): ResponseEntity<Void> {
        emailChangeService.confirmChangeEmailRequest(changeEmailConfirmationRequest.confirmationToken, changeEmailConfirmationRequest.code)
        return ok().build()
    }

    override fun getMe(): ResponseEntity<GetMeResponse> {
        val user = authHolderService.user
        val getMeResponse = GetMeResponse()
        getMeResponse.firstName = user.firstName
        getMeResponse.lastName = user.lastName
        getMeResponse.middleName = user.middleName
        getMeResponse.username = user.username
        getMeResponse.email = user.email
        getMeResponse.canSetEmail = user.email.isNullOrEmpty()
        getMeResponse.canSetPassword = user.password.isNullOrEmpty()
        getMeResponse.canChangePassword = !user.password.isNullOrEmpty()
        getMeResponse.signedViaGoogle = !user.googleId.isNullOrEmpty()
        getMeResponse.signedViaFacebook = !user.facebookId.isNullOrEmpty()
        getMeResponse.signedViaLinkedin = !user.linkedinId.isNullOrEmpty()
        return ok(getMeResponse)
    }
}
