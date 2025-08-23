package org.firstapproval.backend.core.domain.link

import org.springframework.stereotype.Service

@Service
class LinkMappingService(private val linkMappingRepository: LinkMappingRepository) {
    fun resolve(alias: String): String = linkMappingRepository.findValidByAlias(alias).url
}
