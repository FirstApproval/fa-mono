package org.firstapproval.backend.core

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties
import org.firstapproval.backend.core.config.Properties.ElasticSearchProperties
import org.firstapproval.backend.core.domain.archive.ArchiveService
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener

@Configuration
class OnAppStarted(
    private val properties: ElasticSearchProperties,
//    private val archiveService: ArchiveService
) {

    val log = logger {}

    @EventListener(ApplicationStartedEvent::class)
    fun createSandboxProvider() {
        println(properties.host)
        println(properties.port)
        println(properties.scheme)
        println(properties.mode)
        println(properties.username)
        println(properties.password)
//        archiveService.refreshTmpFolder()
//        log.info { "tmp folder refreshed" }
    }
}
