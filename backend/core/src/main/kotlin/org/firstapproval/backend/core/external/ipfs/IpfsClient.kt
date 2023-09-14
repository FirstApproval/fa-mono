package org.firstapproval.backend.core.external.ipfs

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES
import org.firstapproval.backend.core.config.Properties.IpfsProperties
import org.firstapproval.backend.core.utils.require
import org.springframework.core.ParameterizedTypeReference
import org.springframework.core.io.FileSystemResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.*
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
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

    fun getContents(): List<File> {
        val result = restTemplate.exchange(
            properties.contentsUrl,
            GET,
            httpEntity,
            object : ParameterizedTypeReference<List<File>>() {}
        )

        return result.body.require()
    }

    fun getJobs(): List<IpfsJob> {
        val result = restTemplate.exchange(
            properties.jobsUrl,
            GET,
            httpEntity,
            object : ParameterizedTypeReference<List<IpfsJob>>() {}
        )

        return result.body.require()
    }

    fun createJob(contentId: Long, kind: IpfsJobKind): IpfsJob {
        val parts: MultiValueMap<String, Any> = LinkedMultiValueMap()
        parts.add("contentId", contentId)
        parts.add("kind", kind.name.lowercase())
        val httpEntity = HttpEntity(parts, headers)
        val result = restTemplate.exchange(
            properties.jobsUrl,
            POST,
            httpEntity,
            object : ParameterizedTypeReference<IpfsJob>() {}
        )

        return result.body.require()
    }
    fun getJob(jobId: Long): IpfsJob {
        val result = restTemplate.exchange(
            properties.jobsUrl + jobId,
            GET,
            httpEntity,
            object : ParameterizedTypeReference<IpfsJob>() {}
        )

        return result.body.require()
    }

    fun getInfo(id: Long): File {
        val result = restTemplate.exchange(
            properties.contentsUrl + "/${id}",
            GET,
            httpEntity,
            File::class.java
        )

        return result.body.require()
    }

    fun upload(file: java.io.File): File {
        val parts: MultiValueMap<String, Any> = LinkedMultiValueMap()
        parts.add("file_in", FileSystemResource(file))
        val httpEntity = HttpEntity(parts, fileHeaders)

        val result = restTemplate.exchange(
            properties.contentsUrl,
            POST,
            httpEntity,
            File::class.java
        )

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

    fun delete(id: Long): File {
        val result = restTemplate.exchange(
            properties.contentsUrl + "/${id}",
            DELETE,
            httpEntity,
            File::class.java
        )

        return result.body.require()
    }

    data class File(
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

    data class DownloadFile(
        val url: String,
        val expiresIn: Long,
    )

    data class IpfsJob(
        val id: Long,
        val contentId: Long,
        @JsonFormat(with = [ACCEPT_CASE_INSENSITIVE_PROPERTIES])
        val kind: IpfsJobKind,
        val config: String,
        @JsonFormat(with = [ACCEPT_CASE_INSENSITIVE_PROPERTIES])
        val status: IpfsJobStatus,
    )

    enum class IpfsContentAvailability {
        PENDING,
        INSTANT,
        ENCRYPTED,
        ARCHIVE,
        ABSENT
    }

    enum class IpfsJobStatus {
        CREATED,
        ACCEPTED,
        REJECTED,
        INPROGRESS,
        CANCELLED,
        FAILED,
        COMPLETE
    }

    enum class IpfsJobKind {
        ENCRYPT,
        DECRYPT,
        REPLICATE,
        RESTORE
    }
}
