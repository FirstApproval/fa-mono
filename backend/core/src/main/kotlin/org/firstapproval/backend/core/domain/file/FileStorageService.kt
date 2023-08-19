package org.firstapproval.backend.core.domain.file

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.DeleteObjectsRequest
import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectResult
import com.amazonaws.services.s3.model.S3Object
import mu.KotlinLogging.logger
import java.io.InputStream
import java.util.UUID

const val FILES = "files"
const val SAMPLE_FILES = "sample-files"

class FileStorageService(private val amazonS3: AmazonS3) {

    private val log = logger {}

    fun save(bucketName: String, id: String, data: InputStream, contentLength: Long): PutObjectResult {
        val metadata = ObjectMetadata().apply {
            this.contentLength = contentLength
        }
        return amazonS3.putObject(bucketName, id, data, metadata)
    }

    fun delete(bucketName: String, id: UUID) = amazonS3.deleteObject(bucketName, id.toString())

    fun deleteByIds(bucketName: String, ids: List<UUID>) {
        val request = DeleteObjectsRequest(bucketName)
        request.keys = ids.map { KeyVersion(it.toString()) }
        amazonS3.deleteObjects(request)
    }

    fun get(bucketName: String, id: String): S3Object = amazonS3.getObject(bucketName, id)

    fun createBucketIfNotExist(bucketName: String) {
        if (!amazonS3.doesBucketExistV2(bucketName)) {
            amazonS3.createBucket(bucketName)
            log.info { "bucket $bucketName created" }
        }
    }
}
