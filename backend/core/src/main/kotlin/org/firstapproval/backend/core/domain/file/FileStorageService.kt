package org.firstapproval.backend.core.domain.file

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.DeleteObjectsRequest
import com.amazonaws.services.s3.model.DeleteObjectsRequest.KeyVersion
import com.amazonaws.services.s3.model.ObjectMetadata
import mu.KotlinLogging.logger
import java.io.InputStream

const val FILES = "files"

class FileStorageService(private val amazonS3: AmazonS3) {

    private val log = logger {}

    fun save(bucketName: String, id: String, data: InputStream) {
        val metadata = ObjectMetadata()
        amazonS3.putObject(bucketName, id, data, metadata)
    }

    fun delete(bucketName: String, id: String) = amazonS3.deleteObject(bucketName, id)

    fun deleteByIds(bucketName: String, ids: List<String>) {
        val request = DeleteObjectsRequest(bucketName)
        request.keys = ids.map { KeyVersion(it) }
        amazonS3.deleteObjects(request)
    }

    fun get(bucketName: String, id: String): ByteArray = amazonS3.getObject(bucketName, id).objectContent
            .readBytes()

    fun createBucketIfNotExist(bucketName: String) {
        if (!amazonS3.doesBucketExistV2(bucketName)) {
            amazonS3.createBucket(bucketName)
            log.info { "bucket $bucketName created" }
        }
    }
}