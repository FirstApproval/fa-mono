package org.firstapproval.backend.core.config

import org.apache.http.HttpHost
import org.apache.http.auth.AuthScope.ANY
import org.apache.http.auth.UsernamePasswordCredentials
import org.apache.http.impl.client.BasicCredentialsProvider
import org.elasticsearch.client.RestClient
import org.elasticsearch.client.RestHighLevelClient
import org.firstapproval.backend.core.config.Properties.ElasticSearchProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ElasticsearchConfig(
    private val properties: ElasticSearchProperties
) {

    @Bean
    fun elasticSearchRestClient(): RestHighLevelClient {
        println(properties.host)
        println(properties.port)
        println(properties.scheme)
        println(properties.mode)
        println(properties.username)
        println(properties.password)
        val builder = RestClient
            .builder(HttpHost(properties.host, properties.port, properties.scheme))
            .setHttpClientConfigCallback { httpClientBuilder ->
                if (properties.mode == "prod") {
                    val credentialsProvider = BasicCredentialsProvider()
                    credentialsProvider.setCredentials(
                        ANY,
                        UsernamePasswordCredentials(properties.username, properties.password)
                    )
                    httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider)
                }
                httpClientBuilder
            }

        return RestHighLevelClient(builder)
    }
}
