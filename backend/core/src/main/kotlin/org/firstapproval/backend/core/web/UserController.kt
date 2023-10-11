package org.firstapproval.backend.core.web

import org.firstapproval.api.server.UserApi
import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.firstapproval.backend.core.domain.publication.authors.AuthorRepository
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.email.UserEmailService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class UserController(
    private val userService: UserService,
    private val userEmailService: UserEmailService,
    private val jwtService: JwtService,
    private val authorRepository: AuthorRepository,
    private val authHolderService: AuthHolderService,
) : UserApi {

    override fun getUserInfo(id: UUID): ResponseEntity<UserInfo> {
        val user = userService.getPublicUserProfile(id)
        return ok().body(user.toApiObject(userService))
    }

    override fun getUserInfoByUsername(username: String): ResponseEntity<UserInfo> {
        val user = userService.getPublicUserProfile(username)
        return ok().body(
            UserInfo()
                .id(user.id)
                .firstName(user.firstName)
                .lastName(user.lastName)
                .middleName(user.middleName)
                .email(user.email)
                .username(user.username)
                .workplaces(user.workplaces.map { it.toApiObject() })
                .profileImage(userService.getProfileImage(user.profileImage))
        )
    }

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
        val confirmationToken = userEmailService.createChangeEmailRequest(changeEmailRequest.email, authHolderService.user)
        return ok(ChangeEmailResponse(confirmationToken))
    }

    override fun confirmChangeEmail(changeEmailConfirmationRequest: ChangeEmailConfirmationRequest): ResponseEntity<Void> {
        userEmailService.confirmChangeEmailRequest(changeEmailConfirmationRequest.confirmationToken, changeEmailConfirmationRequest.code)
        return ok().build()
    }

    override fun getMe(): ResponseEntity<GetMeResponse> {
        val user = authHolderService.user
        val getMeResponse = GetMeResponse()
        getMeResponse.id = user.id
        getMeResponse.firstName = user.firstName
        getMeResponse.lastName = user.lastName
        getMeResponse.middleName = user.middleName
        getMeResponse.username = user.username
        getMeResponse.email = user.email
        getMeResponse.canSetPassword = user.password.isNullOrEmpty()
        getMeResponse.canChangePassword = !user.password.isNullOrEmpty()
        getMeResponse.profileImage = userService.getProfileImage(user.profileImage)
        getMeResponse.signedVia = user.externalIds.keys.map { OauthType.valueOf(it.name) }
        getMeResponse.workplaces = user.workplaces.map { it.toApiObject() }
        getMeResponse.isNameConfirmed = user.isNameConfirmed
        return ok(getMeResponse)
    }

    @Transactional
    override fun deleteUser(): ResponseEntity<Void> {
        val authors = authorRepository.findAllByUserId(authHolderService.user.id)
        authors.forEach {
            it.isConfirmed = false
            it.user = null
        }
        userService.delete(authHolderService.user.id)
        return ok().build()
    }

    override fun existsByEmail(email: String): ResponseEntity<Boolean> {
        val isExists = userEmailService.existsByEmail(email)
        return ok().body(isExists)
    }

    override fun existsByUsername(username: String): ResponseEntity<Boolean> {
        val isExists = userEmailService.existsByUsername(username)
        return ok().body(isExists)
    }

    override fun updateUser(request: UserUpdateRequest): ResponseEntity<Void> {
        userService.update(authHolderService.user.id, request)
        return ok().build()
    }
}
