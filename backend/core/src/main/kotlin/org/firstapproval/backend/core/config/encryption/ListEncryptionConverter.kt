package org.firstapproval.backend.core.config.encryption

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.firstapproval.backend.core.config.encryption.DatabaseEncryptionStaticBeans.Companion.textEncryptor

@Converter
class StringListEncryptionConverter : AttributeConverter<List<String>, String> {
    override fun convertToDatabaseColumn(values: List<String>?): String? {
        return values?.let { "{" + it.joinToString(",") { list -> textEncryptor.encrypt(list) } + "}" }
    }

    override fun convertToEntityAttribute(dbData: String?): List<String>? {
        return dbData?.let {
            it
                .replace("{", "")
                .replace("}", "")
                .replace("\"", "")
                .split(",").map { v -> textEncryptor.decrypt(v) }.dropLastWhile { v -> v.isEmpty() }
        }
    }
}
