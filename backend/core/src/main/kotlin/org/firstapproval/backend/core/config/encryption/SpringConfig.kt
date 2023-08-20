package org.firstapproval.backend.core.config.encryption

import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean

@AutoConfiguration
class SpringConfig {
    @Bean
    fun enforcedValueAnnotationBeanPostProcessor(context: ApplicationContext) = RestrictedValueAnnotationBeanPostProcessor(context)
}
