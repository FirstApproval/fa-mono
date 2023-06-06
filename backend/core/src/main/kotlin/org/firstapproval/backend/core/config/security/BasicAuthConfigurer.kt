package org.firstapproval.backend.core.config.security

import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.authentication.HttpStatusEntryPoint

class BasicAuthConfigurer : BaseAuthConfigurer<BasicAuthConfigurer>() {
    private lateinit var userDetailsService: UserDetailsService
    private lateinit var authenticationProvider: AuthenticationProvider

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
            .sessionManagement().sessionCreationPolicy(STATELESS)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(HttpStatusEntryPoint(UNAUTHORIZED))
            .and()
            .csrf(StatelessCsrfConfigurer(enableCsrf))

        if (::userDetailsService.isInitialized) {
            http.userDetailsService(userDetailsService)
        }
        if (::authenticationProvider.isInitialized) {
            http.authenticationProvider(authenticationProvider)
        }
    }

    fun setUserDetailsService(userDetailsService: UserDetailsService): BasicAuthConfigurer {
        this.userDetailsService = userDetailsService
        return this
    }

    fun setAuthenticationProvider(authenticationProvider: AuthenticationProvider): BasicAuthConfigurer {
        this.authenticationProvider = authenticationProvider
        return this
    }

    fun inMemoryUser(username: String, encodedPassword: String): BasicAuthConfigurer {
        this.userDetailsService = InMemoryUserDetailsManager(
            User(username, encodedPassword, emptyList())
        )
        return this
    }
}
