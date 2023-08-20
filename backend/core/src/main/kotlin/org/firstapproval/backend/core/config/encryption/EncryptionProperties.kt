package org.firstapproval.backend.core.config.encryption

import org.firstapproval.backend.core.config.encryption.Environment.PROD
import org.firstapproval.backend.core.config.encryption.Environment.STAGE
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties("encryption")
class EncryptionProperties {
    @RestrictedValue(environment = PROD, value = "true")
    @RestrictedValue(environment = STAGE, value = "true")
    var enable = true
    lateinit var encryptionPassword: String
    lateinit var encryptionPasswordSalt: String
    lateinit var encryptedMasterPassword: String
    lateinit var masterPasswordSalt: String
}
