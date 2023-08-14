package org.firstapproval.backend.core.config

import org.firstapproval.backend.core.config.Properties.ElasticProperties
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration
import java.net.InetSocketAddress


@Configuration
class ElasticSearchConfig(private val properties: ElasticProperties): ElasticsearchConfiguration() {

    override fun clientConfiguration(): ClientConfiguration {
        return ClientConfiguration.create(InetSocketAddress.createUnresolved(properties.url.host, properties.url.port))
    }
}
