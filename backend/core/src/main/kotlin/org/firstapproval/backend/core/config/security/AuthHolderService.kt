package org.firstapproval.backend.core.config.security

import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AuthHolderService {

    final inline fun <reified T : Authentication> auth(): T {
        return authOrNull() ?: throw BadCredentialsException("Authentication context is empty")
    }

    final inline fun <reified T : Authentication> authOrNull(): T? {
        return SecurityContextHolder.getContext().authentication as? T
    }
}
