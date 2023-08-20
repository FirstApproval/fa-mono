package org.firstapproval.backend.core.config.encryption

import org.springframework.security.crypto.codec.Hex
import org.springframework.security.crypto.codec.Utf8
import org.springframework.security.crypto.encrypt.BytesEncryptor
import org.springframework.security.crypto.encrypt.TextEncryptor

class HexEncodingTextEncryptor(private val encryptor: BytesEncryptor) : TextEncryptor {
    override fun encrypt(text: String): String {
        return String(Hex.encode(encryptor.encrypt(Utf8.encode(text))))
    }

    override fun decrypt(encryptedText: String): String {
        return Utf8.decode(encryptor.decrypt(Hex.decode(encryptedText)))
    }
}
