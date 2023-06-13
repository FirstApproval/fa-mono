package org.firstapproval.backend.core.config.security

import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter
import org.springframework.security.web.authentication.HttpStatusEntryPoint

class BearerAuthConfigurer : BaseAuthConfigurer<BearerAuthConfigurer>() {
    private lateinit var authenticate: (bearer: BearerAuthentication) -> Authentication

    override fun init(http: HttpSecurity) {
        http
            .securityMatchers()
            .requestMatchers(requestMatcher)
            .and()
            .authorizeHttpRequests()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(
                BearerTokenFilter(
                    protectedEndpointsMatcher = requestMatcher,
                    authenticate = authenticate
                ),
                AnonymousAuthenticationFilter::class.java
            )
            .sessionManagement().sessionCreationPolicy(STATELESS)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(HttpStatusEntryPoint(UNAUTHORIZED))
            .and()
            .csrf(StatelessCsrfConfigurer(enableCsrf))
    }

    fun authenticate(authenticate: (bearer: BearerAuthentication) -> Authentication): BearerAuthConfigurer {
        this.authenticate = authenticate
        return this
    }
}
