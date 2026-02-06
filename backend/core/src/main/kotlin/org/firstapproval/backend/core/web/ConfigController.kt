package org.firstapproval.backend.core.web

import org.firstapproval.api.server.ConfigApi
import org.firstapproval.api.server.model.AppConfig
import org.firstapproval.backend.core.config.Properties.AppProperties
import org.firstapproval.backend.core.config.Properties.CollaborationProperties
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class ConfigController(
    private val collaborationProperties: CollaborationProperties,
    private val appProperties: AppProperties,
) : ConfigApi {
    override fun getConfig(): ResponseEntity<AppConfig> {
        return ok(
            AppConfig()
                .collaborationLicenseDescriptionUrl(collaborationProperties.licenseDescriptionUrl)
                .environment(appProperties.environment)
        )
    }
}
