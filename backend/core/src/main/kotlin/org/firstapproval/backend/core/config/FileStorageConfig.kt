package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.config.Properties.IpfsProperties
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.firstapproval.backend.core.external.ipfs.IpfsClient
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation.WHEN_REQUIRED
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import java.net.URI

@Configuration
class FileStorageConfig {

    @Bean
    fun fileStorage(s3Properties: S3Properties): FileStorageService =
        FileStorageService(defaultS3(s3Properties), s3Properties, defaultS3Presigner(s3Properties)).apply {
            s3Properties.buckets.forEach { createBucketIfNotExist(it) }
        }

    @Bean
    fun defaultS3(s3Properties: S3Properties): S3Client {
        val builder = S3Client.builder()
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(s3Properties.accessKey, s3Properties.secretKey)
                )
            )
            .forcePathStyle(true)
            .serviceConfiguration(
                S3Configuration.builder()
                    .chunkedEncodingEnabled(false)
                    .build()
            )
            .requestChecksumCalculation(WHEN_REQUIRED)

        if (s3Properties.localMode) {
            builder
                .endpointOverride(URI.create(s3Properties.url.toString()))
        }
        builder.region(Region.US_EAST_1)

        return builder.build()
    }

    @Bean
    fun defaultS3Presigner(s3Properties: S3Properties): S3Presigner {
        val builder = S3Presigner.builder()
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(s3Properties.accessKey, s3Properties.secretKey)
                )
            )
            .serviceConfiguration(
                S3Configuration.builder()
                    .pathStyleAccessEnabled(true)
                    .build()
            )

        if (s3Properties.localMode) {
            builder.endpointOverride(URI.create(s3Properties.url.toString()))
                .region(Region.US_EAST_1)
        } else {
            builder.region(Region.US_EAST_1)
        }

        return builder.build()
    }

    @Bean
    fun ipfsClient(ipfsProperties: IpfsProperties, restTemplate: RestTemplate): IpfsClient = IpfsClient(ipfsProperties, restTemplate)
}
