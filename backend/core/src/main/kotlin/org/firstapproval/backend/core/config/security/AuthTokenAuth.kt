package org.firstapproval.backend.core.config.security

import org.firstapproval.backend.core.domain.user.User

class AuthTokenAuth(val user: User) : AuthBase()

val AuthHolderService.user: User get() = auth<AuthTokenAuth>().user
