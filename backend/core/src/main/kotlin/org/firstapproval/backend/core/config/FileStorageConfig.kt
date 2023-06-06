package org.firstapproval.backend.core.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions.DEFAULT_REGION
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder.standard
import com.amazonaws.services.s3.model.CannedAccessControlList.PublicRead
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FileStorageConfig {

    @Bean
    fun defaultS3(s3Properties: S3Properties): AmazonS3 = standard()
        .withCredentials(AWSStaticCredentialsProvider(BasicAWSCredentials(s3Properties.accessKey, s3Properties.secretKey)))
        .withEndpointConfiguration(AwsClientBuilder.EndpointConfiguration(s3Properties.url.toString(), DEFAULT_REGION.name))
        .withPathStyleAccessEnabled(true)
        .build()
        .apply {
            if (!doesBucketExistV2(s3Properties.bucketName)) {
                createBucket(s3Properties.bucketName)
                setBucketAcl(s3Properties.bucketName, PublicRead)
            }
        }
}
