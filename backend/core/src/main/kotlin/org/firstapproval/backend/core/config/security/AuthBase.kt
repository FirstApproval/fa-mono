package org.firstapproval.backend.core.config.security

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority

abstract class AuthBase(
    authorities: Collection<String> = emptyList()
) : AbstractAuthenticationToken(authorities.map { SimpleGrantedAuthority(it) }) {
    override fun isAuthenticated() = true
    override fun getPrincipal(): Any? = null
    override fun getCredentials(): Any? = null
}
