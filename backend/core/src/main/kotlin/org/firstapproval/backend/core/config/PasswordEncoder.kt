package org.firstapproval.backend.core.config

import org.springframework.context.annotation.Bean
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Bean
fun encoder(): PasswordEncoder {
    return BCryptPasswordEncoder()
}