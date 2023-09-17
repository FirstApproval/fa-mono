package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.config.Properties.ElasticSearchProperties
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration

@Configuration
class ElasticSearchConfig(private val properties: ElasticSearchProperties) : ElasticsearchConfiguration() {
    override fun clientConfiguration(): ClientConfiguration {
        return ClientConfiguration
            .builder()
            .connectedTo("${properties.host}:${properties.port}")
            .build()
    }
}
