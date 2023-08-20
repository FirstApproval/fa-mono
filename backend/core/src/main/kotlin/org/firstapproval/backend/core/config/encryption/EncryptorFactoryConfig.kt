package org.firstapproval.backend.core.config.encryption

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class EncryptorFactoryConfig {

    @Bean
    fun encryptorFactory(): EncryptionFactory = EncryptionFactory()
}
