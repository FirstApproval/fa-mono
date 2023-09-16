package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.config.Properties.ElasticSearchProperties
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration

@Configuration
class ElasticSearchConfig2(private val properties: ElasticSearchProperties) : ElasticsearchConfiguration() {
    override fun clientConfiguration(): ClientConfiguration {
        return if (properties.mode == "prod") {
            ClientConfiguration
                .builder()
                .connectedTo("${properties.host}:${properties.port}")
                .usingSsl()
                .withBasicAuth(properties.username, properties.password)
                .build()
        } else {
            ClientConfiguration
                .builder()
                .connectedTo("${properties.host}:${properties.port}")
                .build()
        }
    }
}
