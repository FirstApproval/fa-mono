package org.firstapproval.backend.core.config.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders.AUTHORIZATION
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextHolder.clearContext
import org.springframework.security.web.util.matcher.AnyRequestMatcher
import org.springframework.security.web.util.matcher.RequestMatcher
import org.springframework.web.filter.OncePerRequestFilter

private const val BEARER = "Bearer"

class BearerTokenFilter(
    private val protectedEndpointsMatcher: RequestMatcher = AnyRequestMatcher.INSTANCE!!,
    private var authenticate: ((bearer: BearerAuthentication) -> Authentication)? = null
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = resolveToken(request)
        if (protectedEndpointsMatcher.matches(request) && token != null) {
            try {
                SecurityContextHolder.getContext().authentication = authenticate
                    ?.invoke(BearerAuthentication(token))
                    ?: BearerAuthentication(token)
            } catch (ex: AuthenticationException) {
                clearContext()
            }
        }
        filterChain.doFilter(request, response)
    }

    private fun resolveToken(request: HttpServletRequest): String? =
        request.getHeader(AUTHORIZATION)
            ?.takeIf { it.startsWith(BEARER) }
            ?.substringAfter(BEARER)
            ?.trim()
}

class BearerAuthentication(val token: String) : AbstractAuthenticationToken(emptyList()) {
    override fun getCredentials() = null
    override fun getPrincipal() = "unparsed-bearer-token"
}
