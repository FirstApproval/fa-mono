package org.firstapproval.backend.core.external.doi

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.springframework.core.io.FileSystemResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.POST
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
import java.io.File
import java.io.StringReader
import java.lang.IllegalStateException

@Service
class DoiCrossrefClient(
    private val restTemplate: RestTemplate,
    private val doiProperties: DoiProperties,
) {
    private val headers = HttpHeaders()
    private val log = logger { }

    init {
        headers.contentType = MULTIPART_FORM_DATA
    }

    fun publish(xmlContent: String, publicationId: String) {
        val reader = StringReader(xmlContent)
        val file = File("$publicationId.xml")
        file.createNewFile()

        file.writeText(reader.readText())

        val parts: MultiValueMap<String, Any> = LinkedMultiValueMap()
        parts.add("fname", FileSystemResource(file))
        parts.add("login_id", doiProperties.login)
        parts.add("login_passwd", doiProperties.password)
        val httpEntity = HttpEntity(parts, headers)

        val result = restTemplate.exchange(
            doiProperties.crossrefPublicationEndpoint.toString(),
            POST,
            httpEntity,
            String::class.java
        )
        log.info("Response for doi publication $publicationId: ${result.body}")

        if (!result.statusCode.is2xxSuccessful || result.statusCode.isError) {
            throw IllegalStateException("Response unsuccessful: ${result.statusCode.value()} ${result.body}")
        }
    }
}
