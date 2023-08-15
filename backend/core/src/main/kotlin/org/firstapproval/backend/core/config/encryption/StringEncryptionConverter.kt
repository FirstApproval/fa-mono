package org.firstapproval.backend.core.config.encryption

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.firstapproval.backend.core.config.encryption.DatabaseEncryptionStaticBeans.Companion.textEncryptor

@Converter
class StringEncryptionConverter : AttributeConverter<String, String> {

    override fun convertToDatabaseColumn(entityAttribute: String?): String? =
        entityAttribute?.let { textEncryptor.encrypt(it) }

    override fun convertToEntityAttribute(databaseData: String?): String? =
        databaseData?.let { textEncryptor.decrypt(it) }
}
