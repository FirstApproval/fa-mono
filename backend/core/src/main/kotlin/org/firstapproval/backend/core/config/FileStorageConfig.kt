package org.firstapproval.backend.core.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions
import com.amazonaws.regions.Regions.DEFAULT_REGION
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder.standard
import org.firstapproval.backend.core.config.Properties.IpfsProperties
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.ipfs.IpfsClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

@Configuration
class FileStorageConfig {

    @Bean
    fun fileStorage(s3Properties: S3Properties): FileStorageService =
        FileStorageService(defaultS3(s3Properties), s3Properties).apply {
            s3Properties.buckets.forEach {
                createBucketIfNotExist(it)
            }
        }

    fun defaultS3(s3Properties: S3Properties): AmazonS3 {
        val s3Builder = standard()
            .withCredentials(AWSStaticCredentialsProvider(BasicAWSCredentials(s3Properties.accessKey, s3Properties.secretKey)))
            .withPathStyleAccessEnabled(true)
        if (s3Properties.localMode) {
            s3Builder.withEndpointConfiguration(AwsClientBuilder.EndpointConfiguration(s3Properties.url.toString(), DEFAULT_REGION.name))
        } else {
            s3Builder.withRegion(Regions.US_EAST_1)
        }
        return s3Builder.build()
    }

    @Bean
    fun ipfsClient(ipfsProperties: IpfsProperties, restTemplate: RestTemplate): IpfsClient = IpfsClient(ipfsProperties, restTemplate)
}
