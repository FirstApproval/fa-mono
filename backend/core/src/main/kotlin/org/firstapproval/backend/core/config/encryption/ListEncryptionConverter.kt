package org.firstapproval.backend.core.config.encryption

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.type.TypeFactory
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.firstapproval.backend.core.config.encryption.DatabaseEncryptionStaticBeans.Companion.textEncryptor

@Converter
abstract class ListEncryptionConverter<T>(
    private val clazz: Class<*>
) : AttributeConverter<T, String> {
    override fun convertToDatabaseColumn(entityAttribute: T?): String? {
        return entityAttribute?.let { textEncryptor.encrypt(ObjectMapper().writeValueAsString(it)) }
    }

    override fun convertToEntityAttribute(databaseData: String?): T? {
        val listType = TypeFactory
            .defaultInstance()
            .constructCollectionLikeType(List::class.java, clazz)
        return databaseData?.let { ObjectMapper().readValue(textEncryptor.decrypt(it), listType) }
    }
}

class StringListEncryptionConverter : ListEncryptionConverter<String>(String::class.java)
