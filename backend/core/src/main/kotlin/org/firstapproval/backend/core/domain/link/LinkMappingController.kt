package org.firstapproval.backend.core.domain.link

import org.firstapproval.api.server.LinkMappingApi
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class LinkMappingController(private val linkMappingService: LinkMappingService): LinkMappingApi {
    override fun getLinkByAlias(alias: String): ResponseEntity<String> {
        val url = linkMappingService.resolve(alias)
        return ok(url)
    }
}
