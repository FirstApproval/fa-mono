package org.firstapproval.backend.core.config

import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpInputMessage
import org.springframework.http.HttpOutputMessage
import org.springframework.http.MediaType.TEXT_PLAIN
import org.springframework.http.converter.AbstractHttpMessageConverter
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class CustomMessageConverterConfig : WebMvcConfigurer {
    override fun configureMessageConverters(converters: MutableList<HttpMessageConverter<*>?>) {
        converters.add(LongToTextHttpMessageConverter())
    }

    private class LongToTextHttpMessageConverter : AbstractHttpMessageConverter<Long?>(TEXT_PLAIN) {
        override fun supports(clazz: Class<*>): Boolean {
            return clazz == java.lang.Long::class.java || Long::class.java.isAssignableFrom(clazz)
        }

        override fun readInternal(clazz: Class<out Long?>, inputMessage: HttpInputMessage): Long {
            TODO("Not yet implemented")
        }

        override fun writeInternal(aLong: Long, outputMessage: HttpOutputMessage) {
            // Convert the Long to a plain text representation and write it to the response
            val longAsString = aLong.toString()
            val outputStream = outputMessage.body
            outputStream.write(longAsString.toByteArray())
            outputStream.flush()
        }
    }
}
