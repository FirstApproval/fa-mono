package org.firstapproval.backend.core.config.encryption

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.type.TypeFactory
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.firstapproval.backend.core.config.encryption.DatabaseEncryptionStaticBeans.Companion.textEncryptor

@Converter
class StringListEncryptionConverter : AttributeConverter<List<String>, String> {
    override fun convertToDatabaseColumn(values: List<String>?): String? {
        return values?.let { textEncryptor.encrypt(ObjectMapper().writeValueAsString(it)) }
    }

    override fun convertToEntityAttribute(dbData: String?): List<String>? {
        val listType = TypeFactory
            .defaultInstance()
            .constructCollectionLikeType(List::class.java, String::class.java)
        return dbData?.let { ObjectMapper().readValue(textEncryptor.decrypt(it), listType) }
    }
}
