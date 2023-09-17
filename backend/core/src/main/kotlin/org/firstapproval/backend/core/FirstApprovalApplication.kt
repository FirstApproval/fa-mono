package org.firstapproval.backend.core

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import java.util.TimeZone
import java.util.TimeZone.setDefault

@SpringBootApplication
@EnableJpaRepositories("org.firstapproval.backend.core")
@EnableElasticsearchRepositories("org.firstapproval.backend.core")
class FirstApprovalApplication

fun main(args: Array<String>) {
    setDefault(TimeZone.getTimeZone("UTC"))
    runApplication<FirstApprovalApplication>(*args)
}
