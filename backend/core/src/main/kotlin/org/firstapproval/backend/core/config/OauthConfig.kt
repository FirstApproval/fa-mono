package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.domain.auth.OauthUserSupplier
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OauthConfig {
    @Bean
    fun oauthUserSuppliers(context: ApplicationContext): Map<String, OauthUserSupplier> {
        return context.getBeansOfType(OauthUserSupplier::class.java)
    }
}
