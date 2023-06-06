package org.firstapproval.backend.core.config.security

import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy
import org.springframework.security.web.csrf.CookieCsrfTokenRepository.withHttpOnlyFalse
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler

class StatelessCsrfConfigurer(private val enable: Boolean) : Customizer<CsrfConfigurer<HttpSecurity>> {

    override fun customize(csrfConfigurer: CsrfConfigurer<HttpSecurity>) {
        if (enable) {
            // set the name of the attribute the CsrfToken will be populated on
            // see https://docs.spring.io/spring-security/reference/5.8.0/migration/servlet/exploits.html#_defer_loading_csrftoken
            val requestHandler = CsrfTokenRequestAttributeHandler()
            requestHandler.setCsrfRequestAttributeName(null)

            // Because we have a stateless app, we can't use a session to store a csrf token, so we store it in a cookie.
            // Also, we have to disable CsrfAuthenticationStrategy, because it changes csrf tokens on each request
            // and that quickly leads to errors with concurrent requests,
            // see https://github.com/spring-projects/spring-security/issues/5300#issuecomment-501335705
            csrfConfigurer
                .csrfTokenRepository(withHttpOnlyFalse())
                .sessionAuthenticationStrategy(NullAuthenticatedSessionStrategy())
                .csrfTokenRequestHandler(requestHandler)
        } else {
            csrfConfigurer.disable()
        }
    }
}
