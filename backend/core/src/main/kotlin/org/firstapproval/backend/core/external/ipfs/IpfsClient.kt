package org.firstapproval.backend.core.external.ipfs

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES
import com.fasterxml.jackson.annotation.JsonProperty
import org.firstapproval.backend.core.config.Properties.IpfsProperties
import org.firstapproval.backend.core.utils.require
import org.springframework.core.io.FileSystemResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.*
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
import java.lang.IllegalStateException
import java.time.LocalDateTime

class IpfsClient(
    private val properties: IpfsProperties,
    private val restTemplate: RestTemplate
) {
    private val headers = HttpHeaders()
    private val httpEntity = HttpEntity(null, headers)
    private val fileHeaders = HttpHeaders()

    init {
        headers.accept = listOf(APPLICATION_JSON)
        headers.set("Authorization", properties.accessKey)

        fileHeaders.contentType = MULTIPART_FORM_DATA
        fileHeaders.accept = listOf(APPLICATION_JSON)
        fileHeaders.set("Authorization", properties.accessKey)
    }

    fun getInfo(id: Long): IpfsFile {
        val result = restTemplate.exchange(
            properties.contentsUrl + "/${id}",
            GET,
            httpEntity,
            IpfsFile::class.java
        )

        return result.body.require()
    }

    fun restore(id: Long) {
        val httpEntity = HttpEntity(mapOf("restoreDays" to 1), headers)

        val response = restTemplate.exchange(
            properties.contentsUrl + "/${id}/restore",
            POST,
            httpEntity,
            RestoreResponse::class.java
        )
        val responseData = response.body.require()
        if (responseData.status != "ok" && responseData.id == null) {
            throw IpfsException("Status is not ok and no data returned")
        }
    }

    fun upload(file: java.io.File): IpfsFile {
        val parts: MultiValueMap<String, Any> = LinkedMultiValueMap()
        parts.add("file_in", FileSystemResource(file)) //TODO think how improve it
        val httpEntity = HttpEntity(parts, fileHeaders)

        val result = restTemplate.exchange(
            properties.contentsUrl,
            POST,
            httpEntity,
            IpfsFile::class.java
        )

        if (!result.statusCode.is2xxSuccessful) {
            throw IllegalStateException()
        }

        return result.body.require()
    }

    fun getDownloadLink(id: Long): DownloadFile {
        val result = restTemplate.exchange(
            properties.contentsUrl + "/${id}/download",
            GET,
            httpEntity,
            DownloadFile::class.java
        )

        return result.body.require()
    }

    fun delete(id: Long): IpfsFile {
        val result = restTemplate.exchange(
            properties.contentsUrl + "/${id}",
            DELETE,
            httpEntity,
            IpfsFile::class.java
        )

        return result.body.require()
    }

    class IpfsFile(
        val id: Long,
        val filename: String,
        val origin: String? = null,
        val ipfsCid: String,
        val ipfsFileSize: Long,
        val encryptedFileCid: String? = null,
        @JsonFormat(with = [ACCEPT_CASE_INSENSITIVE_PROPERTIES])
        val availability: IpfsContentAvailability,
        val ownerId: Long,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
    )

    class RestoreResponse(
        var status: String? = null,
        val id: Long? = null,
        val filename: String? = null,
        val origin: String? = null,
        @JsonProperty("ipfs_cid")
        val ipfsCid: String? = null,
        @JsonProperty("encrypted_file_cid")
        val encryptedFileCid: String? = null,
        @JsonProperty("encrypted_file_size")
        val encryptedFileSize: Long? = null,
        @JsonProperty("ipfs_file_size")
        val ipfsFileSize: Long? = null,
        @JsonFormat(with = [ACCEPT_CASE_INSENSITIVE_PROPERTIES])
        var availability: IpfsContentAvailability? = null,
        @JsonProperty("owner_id")
        val ownerId: Long? = null,
        @JsonProperty("instant_till")
        var instantTill: LocalDateTime? = null,
        @JsonProperty("created_at")
        val createdAt: LocalDateTime? = null,
        @JsonProperty("updated_at")
        val updatedAt: LocalDateTime? = null,
        val key: String? = null
    )

    class DownloadFile(
        val url: String,
        @JsonProperty("expires_in")
        val expiresIn: Long,
    )

    enum class IpfsContentAvailability {
        INSTANT,
        ARCHIVE,
    }
}
