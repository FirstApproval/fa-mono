package org.firstapproval.backend.core.external.s3

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.DeleteObjectsRequest
import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectResult
import com.amazonaws.services.s3.model.ResponseHeaderOverrides
import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.model.StorageClass
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.firstapproval.backend.core.utils.calculateSHA256
import java.io.InputStream
import java.time.Duration
import java.util.Date
import java.util.UUID

const val FILES = "files"
const val SAMPLE_FILES = "sample-files"
const val ARCHIVED_PUBLICATION_FILES = "archived-publication-files"
const val ARCHIVED_PUBLICATION_SAMPLE_FILES = "archived-publication-sample-files"
const val PROFILE_IMAGES = "profile-images"

class FileStorageService(private val amazonS3: AmazonS3, private val s3Properties: S3Properties) {

    private val log = logger {}

    fun save(
        bucketName: String,
        id: String,
        data: InputStream,
        contentLength: Long,
        sha256HexBase64: String? = null
    ): PutObjectResult {
        val metadata = ObjectMetadata()
        metadata.apply {
            this.contentLength = contentLength
        }
        metadata.setHeader("x-amz-storage-class", s3Properties.bucketStorageClass)

        if (sha256HexBase64 != null) {
            metadata.setHeader("x-amz-sdk-checksum-algorithm", "SHA256")
            metadata.setHeader("x-amz-checksum-sha256", sha256HexBase64)
        }
        return amazonS3.putObject(bucketName + s3Properties.bucketPostfix, id, data, metadata)
    }

    fun delete(bucketName: String, id: UUID) = amazonS3.deleteObject(bucketName + s3Properties.bucketPostfix, id.toString())

    fun deleteByIds(bucketName: String, ids: List<UUID>) {
        val request = DeleteObjectsRequest(bucketName + s3Properties.bucketPostfix)
        request.keys = ids.map { KeyVersion(it.toString()) }
        amazonS3.deleteObjects(request)
    }

    fun get(bucketName: String, id: String): S3Object = amazonS3.getObject(bucketName + s3Properties.bucketPostfix, id)

    fun createBucketIfNotExist(bucketName: String) {
        if (!amazonS3.doesBucketExistV2(bucketName + s3Properties.bucketPostfix)) {
            amazonS3.createBucket(bucketName + s3Properties.bucketPostfix)
            log.info { "bucket $bucketName created" }
        }
    }

    fun generateTemporaryDownloadLink(bucketName: String, id: String, contentDisposition: String): String {
        val expiration = Date(System.currentTimeMillis() + s3Properties.downloadLinkTtl.toMillis())
        val generatePresignedUrlRequest = GeneratePresignedUrlRequest(bucketName + s3Properties.bucketPostfix, id)
            .withExpiration(expiration)
            .withResponseHeaders(ResponseHeaderOverrides().withContentDisposition("attachment; filename=\"$contentDisposition\""))
        val url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest)
        return url.toString()
    }
}
