package org.firstapproval.backend.core.config.encryption

import org.springframework.security.crypto.encrypt.BytesEncryptor

class NoopBytesEncryptor : BytesEncryptor {
    override fun encrypt(bytes: ByteArray): ByteArray = bytes
    override fun decrypt(encryptedBytes: ByteArray): ByteArray = encryptedBytes
}
