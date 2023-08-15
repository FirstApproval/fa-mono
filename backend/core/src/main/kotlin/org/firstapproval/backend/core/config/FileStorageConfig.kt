package org.firstapproval.backend.core.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions.DEFAULT_REGION
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder.standard
import org.firstapproval.backend.core.config.Properties.IpfsProperties
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.firstapproval.backend.core.config.encryption.BYTES_ENCRYPTOR_BEAN
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.encrypt.BytesEncryptor
import org.springframework.web.client.RestTemplate

@Configuration
class FileStorageConfig {

    @Bean
    fun fileStorage(s3Properties: S3Properties, applicationContext: ApplicationContext): FileStorageService {
        val encryptor = applicationContext.getBean(BYTES_ENCRYPTOR_BEAN, BytesEncryptor::class.java)
        return FileStorageService(defaultS3(s3Properties), encryptor).apply {
            s3Properties.buckets.forEach {
                createBucketIfNotExist(it)
            }
        }
    }

    fun defaultS3(s3Properties: S3Properties): AmazonS3 = standard()
        .withCredentials(AWSStaticCredentialsProvider(BasicAWSCredentials(s3Properties.accessKey, s3Properties.secretKey)))
        .withEndpointConfiguration(AwsClientBuilder.EndpointConfiguration(s3Properties.url.toString(), DEFAULT_REGION.name))
        .withPathStyleAccessEnabled(true)
        .build()

    @Bean
    fun ipfsClient(ipfsProperties: IpfsProperties, restTemplate: RestTemplate): IpfsClient = IpfsClient(ipfsProperties, restTemplate)
}
