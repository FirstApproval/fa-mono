package org.firstapproval.backend.core.config

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

const val DEFAULT_REST_TEMPLATE = "defaultRestTemplate"

@Configuration
class RestTemplateConfig {

    @Bean
    @Qualifier(DEFAULT_REST_TEMPLATE)
    fun defaultRestTemplate() = RestTemplate()
}
