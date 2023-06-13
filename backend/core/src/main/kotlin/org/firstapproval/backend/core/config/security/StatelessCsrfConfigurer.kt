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
            val requestHandler = CsrfTokenRequestAttributeHandler()
            requestHandler.setCsrfRequestAttributeName(null)
            csrfConfigurer
                .csrfTokenRepository(withHttpOnlyFalse())
                .sessionAuthenticationStrategy(NullAuthenticatedSessionStrategy())
                .csrfTokenRequestHandler(requestHandler)
        } else {
            csrfConfigurer.disable()
        }
    }
}
