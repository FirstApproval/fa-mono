package org.firstapproval.backend.core.config.security

import org.springframework.security.core.AuthenticationException

open class InvalidTokenException(cause: Throwable? = null) : AuthenticationException(cause?.message)
