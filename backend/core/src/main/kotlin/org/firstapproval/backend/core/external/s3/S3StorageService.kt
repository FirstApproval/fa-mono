package org.firstapproval.backend.core.external.s3

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.AbortMultipartUploadRequest
import com.amazonaws.services.s3.model.CompleteMultipartUploadRequest
import com.amazonaws.services.s3.model.DeleteObjectsRequest
import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest
import com.amazonaws.services.s3.model.InitiateMultipartUploadRequest
import com.amazonaws.services.s3.model.InitiateMultipartUploadResult
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PartETag
import com.amazonaws.services.s3.model.ResponseHeaderOverrides
import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.model.UploadPartRequest
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.S3Properties
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.security.MessageDigest
import java.util.Base64
import java.util.Date
import java.util.UUID

const val FILES = "files"
const val SAMPLE_FILES = "sample-files"
const val ARCHIVED_PUBLICATION_FILES = "archived-publication-files"
const val ARCHIVED_PUBLICATION_SAMPLE_FILES = "archived-publication-sample-files"
const val PROFILE_IMAGES = "profile-images"
const val REPORT_FILES = "report-files"

private const val FOUR_GB = 4 * 1024 * 1024 * 1024L

class FileStorageService(private val amazonS3: AmazonS3, private val s3Properties: S3Properties) {

    private val log = logger {}

    fun save(
        bucketName: String,
        id: String,
        data: InputStream,
        contentLength: Long,
        sha256HexBase64: String? = null
    ) {
        val metadata = ObjectMetadata()
        metadata.apply {
            this.contentLength = contentLength
        }
        metadata.setHeader("x-amz-storage-class", s3Properties.bucketStorageClass)

        if (contentLength > FOUR_GB) {
            uploadLargeFile(bucketName, id, contentLength, sha256HexBase64, data)
        } else {
            if (sha256HexBase64 != null) {
                metadata.setHeader("x-amz-sdk-checksum-algorithm", "SHA256")
                metadata.setHeader("x-amz-checksum-sha256", sha256HexBase64)
            }
            amazonS3.putObject(bucketName + s3Properties.bucketPostfix, id, data, metadata)
        }
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

    private fun uploadLargeFile(bucketName: String, key: String, contentLength: Long, sha256HexBase64: String?, inputStream: InputStream) {
        val initRequest = InitiateMultipartUploadRequest(bucketName, key)
        initRequest.objectMetadata = ObjectMetadata()
        initRequest.objectMetadata.contentLength = contentLength
        val initResponse = amazonS3.initiateMultipartUpload(initRequest)

        var bytesRead: Int
        val data = ByteArray(5 * 1024 * 1024)

        var pageNumber = 0

        val partETags = mutableListOf<PartETag>()

        val md = MessageDigest.getInstance("SHA-256")

        while (inputStream.read(data).also { bytesRead = it } != -1) {
            val trimmed = data.copyOfRange(0, bytesRead)
            val uploadRequest = UploadPartRequest().withUploadId(initResponse.uploadId)
                .withBucketName(bucketName)
                .withKey(key)
                .withInputStream(ByteArrayInputStream(trimmed))
                .withPartSize(trimmed.size.toLong())
                .withPartNumber(pageNumber)
            val uploadResult = amazonS3.uploadPart(uploadRequest)
            partETags.add(uploadResult.partETag)
            md.update(data, 0, bytesRead);
            pageNumber++
        }
        val completeRequest = CompleteMultipartUploadRequest(bucketName, key, initResponse.uploadId, partETags)
        val sha256OfFile = Base64.getEncoder().encodeToString(md.digest())
        if (sha256HexBase64 != null && sha256OfFile != sha256HexBase64) {
            amazonS3.abortMultipartUpload(AbortMultipartUploadRequest(bucketName, key, initResponse.uploadId))
        } else {
            amazonS3.completeMultipartUpload(completeRequest)
        }
    }
}
