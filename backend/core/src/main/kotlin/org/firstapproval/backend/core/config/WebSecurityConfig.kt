package org.firstapproval.backend.core.config

import io.jsonwebtoken.JwtException
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.security.*
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.user.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.logout.LogoutFilter

@EnableWebSecurity
@Configuration
class WebSecurityConfig {

    val log = logger {}
    @Bean
    @Order(0)
    fun publicAuthSecurityFilterChain(
        http: HttpSecurity,
        apiService: ApiService
    ): SecurityFilterChain {
        http.apply(PublicAuthConfigurer())
            .requestMatcher(*apiService.getAllPathsByScheme("PublicAuth"))
        return http.build()
    }

    @Bean
    @Order(1)
    fun bearerAuthTokenSecurityFilterChain(
        http: HttpSecurity,
        apiService: ApiService,
        tokenService: TokenService,
        userService: UserService,
        filterChainExceptionHandler: FilterChainExceptionHandler
    ): SecurityFilterChain {
        http.apply(BearerAuthConfigurer())
            .requestMatcher(*apiService.getAllPathsByScheme("TokenAuth"))
            .authenticate { bearer ->
                try {
                    val authorizationToken = tokenService.checkAndParseAuthToken(bearer.token)
                    AuthTokenAuth(userService.get(authorizationToken.userId))
                } catch (ex: Exception) {
                    if (ex !is JwtException) {
                        log.error(ex) {"jwt parsing error"}
                    }
                    throw InvalidTokenException()
                }
            }
            .and()
            .addFilterBefore(filterChainExceptionHandler, LogoutFilter::class.java)
            .exceptionHandling {
                it.authenticationEntryPoint(HttpStatusEntryPoint(UNAUTHORIZED))
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
        return http.build()
    }
}
