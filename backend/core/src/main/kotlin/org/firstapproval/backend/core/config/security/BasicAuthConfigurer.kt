package org.firstapproval.backend.core.config.security

import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.authentication.HttpStatusEntryPoint

class BasicAuthConfigurer : BaseAuthConfigurer<BasicAuthConfigurer>() {
    private lateinit var userDetailsService: UserDetailsService

    override fun init(http: HttpSecurity) {
        http
            .securityMatchers()
            .requestMatchers(requestMatcher)
            .and()
            .authorizeHttpRequests()
            .anyRequest().authenticated()
            .and()
            .httpBasic()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
            .csrf(StatelessCsrfConfigurer(enableCsrf))

        if (::userDetailsService.isInitialized) {
            http.userDetailsService(userDetailsService)
        }
    }

    fun inMemoryUser(username: String, encodedPassword: String): BasicAuthConfigurer {
        this.userDetailsService = InMemoryUserDetailsManager(
            User(username, encodedPassword, emptyList())
        )
        return this
    }
}

