package org.firstapproval.backend.core.config.security

import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS

class PublicAuthConfigurer : BaseAuthConfigurer<PublicAuthConfigurer>() {
    override fun init(http: HttpSecurity) {
        http
            .securityMatchers()
            .requestMatchers(requestMatcher)
            .and()
            .authorizeHttpRequests()
            .anyRequest().permitAll()
            .and()
            .sessionManagement().sessionCreationPolicy(STATELESS)
            .and()
            .csrf(StatelessCsrfConfigurer(enableCsrf))
    }
}
