package org.firstapproval.backend.core.config.encryption

import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.encrypt.BytesEncryptor
import org.springframework.security.crypto.encrypt.Encryptors.noOpText
import org.springframework.security.crypto.encrypt.TextEncryptor

@Configuration
class EncryptionConfig(
    private val encryptionProperties: EncryptionProperties,
    private val databaseEncryptionProperties: EncryptionProperties,
    private val encryptionFactory: EncryptionFactory
) {
    @Bean(TEXT_ENCRYPTOR_BEAN)
    fun textEncryptor(): TextEncryptor =
        if (encryptionProperties.enable) {
            encryptionFactory.textEncryptor(databaseEncryptionProperties)
        } else {
            noOpText()
        }

    @Bean(BYTES_ENCRYPTOR_BEAN)
    fun bytesEncryptor(): BytesEncryptor =
        if (encryptionProperties.enable) {
            encryptionFactory.bytesEncryptor(databaseEncryptionProperties)
        } else {
            NoopBytesEncryptor()
        }

    @Bean
    fun databaseEncryptionStaticBeans(applicationContext: ApplicationContext): DatabaseEncryptionStaticBeans =
        DatabaseEncryptionStaticBeans(applicationContext)
}
