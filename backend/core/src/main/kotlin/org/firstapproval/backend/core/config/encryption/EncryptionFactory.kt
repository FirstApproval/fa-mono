package org.firstapproval.backend.core.config.encryption

import org.springframework.security.crypto.encrypt.AesBytesEncryptor
import org.springframework.security.crypto.encrypt.BytesEncryptor
import org.springframework.security.crypto.encrypt.Encryptors.delux
import org.springframework.security.crypto.encrypt.Encryptors.stronger
import org.springframework.security.crypto.encrypt.TextEncryptor

class EncryptionFactory {

    fun textEncryptor(encryptionProperties: EncryptionProperties): TextEncryptor =
        HexEncodingTextEncryptor(
            AesBytesEncryptor(decryptPassword(encryptionProperties), encryptionProperties.masterPasswordSalt)
        )

    fun bytesEncryptor(encryptionProperties: EncryptionProperties): BytesEncryptor =
        stronger(decryptPassword(encryptionProperties), encryptionProperties.masterPasswordSalt)

    private fun decryptPassword(secretProps: EncryptionProperties): String {
        return delux(
            secretProps.encryptionPassword,
            secretProps.encryptionPasswordSalt,
        ).decrypt(secretProps.encryptedMasterPassword)
    }
}
