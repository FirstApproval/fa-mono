package org.firstapproval.backend.core.config.encryption

import org.springframework.context.ApplicationContext
import org.springframework.security.crypto.encrypt.TextEncryptor

const val TEXT_ENCRYPTOR_BEAN = "text_encryptor"

const val BYTES_ENCRYPTOR_BEAN = "bytes_encryptor"

class DatabaseEncryptionStaticBeans(applicationContext: ApplicationContext) {

    init {
        context = applicationContext
    }

    companion object {
        private lateinit var context: ApplicationContext

        val textEncryptor: TextEncryptor by lazy {
            context.getBean(TEXT_ENCRYPTOR_BEAN, TextEncryptor::class.java)
        }
    }
}
