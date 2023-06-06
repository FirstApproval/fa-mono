package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.config.security.ApiService
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun apiService(configurableListableBeanFactory: ConfigurableListableBeanFactory): ApiService =
        ApiService(configurableListableBeanFactory)
}
