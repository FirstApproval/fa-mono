package org.firstapproval.backend.core.web

import org.firstapproval.api.server.UserApi
import org.firstapproval.api.server.model.*
import org.firstapproval.api.server.model.OauthType
import org.firstapproval.api.server.model.PasswordChangeRequest
import org.firstapproval.api.server.model.PasswordResetRequest
import org.firstapproval.api.server.model.RequestPasswordResetRequest
import org.firstapproval.api.server.model.SetPasswordRequest
import org.firstapproval.api.server.model.UserUpdateRequest
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.JwtService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthorRepository
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthor
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthorRepository
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.email.UserEmailService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import java.util.UUID.randomUUID

@RestController
class UserController(
    private val userService: UserService,
    private val userEmailService: UserEmailService,
    private val jwtService: JwtService,
    private val unconfirmedAuthorRepository: UnconfirmedAuthorRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository,
    private val authHolderService: AuthHolderService,
) : UserApi {

    override fun getUserInfo(id: UUID): ResponseEntity<UserInfo> {
        val user = userService.getPublicUserProfile(id)
        return ok().body(
            UserInfo()
                .id(user.id)
                .firstName(user.firstName)
                .lastName(user.lastName)
                .middleName(user.middleName)
                .email(user.email)
                .username(user.username)
                .selfInfo(user.selfInfo)
                .profileImage(userService.getProfileImage(user.profileImage)))
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
        getMeResponse.firstName = user.firstName
        getMeResponse.lastName = user.lastName
        getMeResponse.middleName = user.middleName
        getMeResponse.username = user.username
        getMeResponse.email = user.email
        getMeResponse.canSetPassword = user.password.isNullOrEmpty()
        getMeResponse.canChangePassword = !user.password.isNullOrEmpty()
        getMeResponse.selfInfo = user.selfInfo
        getMeResponse.signedVia = user.externalIds.keys.map { OauthType.valueOf(it.name) }
        return ok(getMeResponse)
    }

    @Transactional
    override fun deleteUser(): ResponseEntity<Void> {
        val confirmedAuthors = confirmedAuthorRepository.findAllByUserId(authHolderService.user.id)
        val unconfirmedAuthors = confirmedAuthors.map {
            UnconfirmedAuthor(
                randomUUID(),
                it.publication,
                it.user.email,
                it.user.firstName,
                it.user.middleName,
                it.user.lastName,
                it.shortBio
            )
        }
        unconfirmedAuthorRepository.saveAll(unconfirmedAuthors)
        confirmedAuthorRepository.deleteAll(confirmedAuthors)
        userService.delete(authHolderService.user.id)
        return ok().build()
    }

    override fun existsByEmail(email: String): ResponseEntity<Boolean> {
        val isExists = userEmailService.existsByEmail(email)
        return ok().body(isExists)
    }

    override fun updateUser(request: UserUpdateRequest): ResponseEntity<Void> {
        userService.update(
            id = authHolderService.user.id,
            firstName = request.firstName,
            middleName = request.middleName,
            lastName = request.lastName,
            username = request.username,
            selfInfo = request.selfInfo,
            profileImage = request.profileImage
        )
        return ok().build()
    }
}
