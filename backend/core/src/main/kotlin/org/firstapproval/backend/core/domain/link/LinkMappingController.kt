package org.firstapproval.backend.core.domain.link

import org.firstapproval.api.server.LinkMappingApi
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.firstapproval.api.server.model.LinkMapping as LinkMappingApiObject

@RestController
class LinkMappingController(private val linkMappingService: LinkMappingService) : LinkMappingApi {
    override fun getLinkByAlias(alias: String): ResponseEntity<LinkMappingApiObject> {
        val linkMapping = linkMappingService.findValidByAlias(alias)
        return ok(linkMapping.toApiObject())
    }
}
