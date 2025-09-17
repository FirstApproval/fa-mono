package org.firstapproval.backend.core.external.s3

import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.*
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.S3Properties
import software.amazon.awssdk.core.ResponseInputStream
import software.amazon.awssdk.core.sync.ResponseTransformer
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.security.MessageDigest
import java.time.Duration
import java.util.*

const val FILES = "files"
const val SAMPLE_FILES = "sample-files"
const val ACADEMIC_SUPERVISOR_LETTERS = "academic-supervisor-letters"
const val ARCHIVED_PUBLICATION_FILES = "archived-publication-files"
const val ARCHIVED_PUBLICATION_SAMPLE_FILES = "archived-publication-sample-files"
const val PROFILE_IMAGES = "profile-images"
const val REPORT_FILES = "report-files"

const val BATCH_SIZE = 10 * 1024 * 1024

class FileStorageService(private val s3Client: S3Client, private val s3Properties: S3Properties, private val s3Presigner: S3Presigner) {

    private val log = logger {}

    fun save(
        bucketName: String,
        id: String,
        data: InputStream,
        contentLength: Long? = null,
        sha256HexBase64: String? = null
    ) {
        val bucket = bucketName + s3Properties.bucketPostfix

        uploadLargeFile(bucket, id, sha256HexBase64, data)
    }

    fun delete(bucketName: String, id: UUID) {
        val deleteRequest = DeleteObjectRequest.builder()
            .bucket(bucketName + s3Properties.bucketPostfix)
            .key(id.toString())
            .build()

        s3Client.deleteObject(deleteRequest)
    }

    fun deleteByIds(bucketName: String, ids: List<UUID>) {
        if (ids.isEmpty()) return
        val deleteObjectsRequest = DeleteObjectsRequest.builder()
            .bucket(bucketName + s3Properties.bucketPostfix)
            .delete(
                Delete.builder()
                    .objects(ids.map { ObjectIdentifier.builder().key(it.toString()).build() })
                    .build()
            )
            .build()

        s3Client.deleteObjects(deleteObjectsRequest)
    }

    fun get(bucketName: String, id: String): ResponseInputStream<GetObjectResponse> =
        s3Client.getObject(
            GetObjectRequest.builder()
                .bucket(bucketName + s3Properties.bucketPostfix)
                .key(id)
                .build(),
            ResponseTransformer.toInputStream()
        )

    fun createBucketIfNotExist(bucketName: String) {
        val bucket = bucketName + s3Properties.bucketPostfix
        if (!s3Client.listBuckets().buckets().any { it.name() == bucket }) {
            s3Client.createBucket(CreateBucketRequest.builder().bucket(bucket).build())
            log.info { "Bucket $bucketName created" }
        }
    }

    fun generateTemporaryDownloadLink(bucketName: String, id: String, contentDisposition: String): String {
        val presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMillis(s3Properties.downloadLinkTtl.toMillis()))
            .getObjectRequest { builder ->
                builder.bucket(bucketName + s3Properties.bucketPostfix).key(id)
                    .responseContentDisposition("attachment; filename=\"$contentDisposition\"")
            }
            .build()

        val presignedUrl = s3Presigner.presignGetObject(presignRequest)
        return presignedUrl.url().toString()
    }

    private fun uploadLargeFile(bucketName: String, key: String, sha256HexBase64: String?, inputStream: InputStream) {
        val createRequest = CreateMultipartUploadRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()

        val initResponse = s3Client.createMultipartUpload(createRequest)

        var bytesRead: Int
        val data = ByteArray(BATCH_SIZE)
        var pageNumber = 1
        val completedParts = mutableListOf<CompletedPart>()
        val md = MessageDigest.getInstance("SHA-256")

        try {
            inputStream.use { stream ->
                while (stream.read(data).also { bytesRead = it } != -1) {
                    val uploadRequest = UploadPartRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .uploadId(initResponse.uploadId())
                        .partNumber(pageNumber)
                        .contentLength(bytesRead.toLong())
                        .build()

                    val uploadResult = s3Client.uploadPart(uploadRequest, RequestBody.fromInputStream(
                        ByteArrayInputStream(data, 0, bytesRead), bytesRead.toLong()
                    ))
                    completedParts.add(
                        CompletedPart.builder()
                            .partNumber(pageNumber)
                            .eTag(uploadResult.eTag())
                            .build()
                    )

                    md.update(data, 0, bytesRead)
                    pageNumber++
                }

                val sha256HexBase64OfFile = Base64.getEncoder().encodeToString(md.digest())
                if (sha256HexBase64 != null && sha256HexBase64OfFile != sha256HexBase64) {
                    log.error { "SHA-256 mismatch: expected $sha256HexBase64, got $sha256HexBase64OfFile" }
                    s3Client.abortMultipartUpload(
                        AbortMultipartUploadRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .uploadId(initResponse.uploadId())
                            .build()
                    )
                } else {
                    val completeRequest = CompleteMultipartUploadRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .uploadId(initResponse.uploadId())
                        .multipartUpload { it.parts(completedParts) }
                        .build()

                    s3Client.completeMultipartUpload(completeRequest)
                }
            }
        } catch (e: Exception) {
            log.error(e) { "Error during multipart upload" }
            s3Client.abortMultipartUpload(
                AbortMultipartUploadRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .uploadId(initResponse.uploadId())
                    .build()
            )
            throw e
        }
    }
}
