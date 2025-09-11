package org.firstapproval.backend.core.web

import org.firstapproval.api.server.VisitorApi
import org.firstapproval.backend.core.domain.visitor.Visitor
import org.firstapproval.backend.core.domain.visitor.VisitorRepository
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes


@RestController
class VisitorController(
    private val visitorRepository: VisitorRepository,
) : VisitorApi {
    override fun saveVisitor(utmSource: String?, utmMedium: String?, utmCampaign: String?, initialReferrer: String?): ResponseEntity<Void> {
        val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes?)!!.request
        val ip = request.getHeader("X-Forwarded-For")?.split(",")?.firstOrNull() ?: request.remoteAddr
        val visitor = Visitor(
            ip = ip,
            utmSource = utmSource,
//            utmMedium = utmMedium,
//            utmCampaign = utmCampaign,
            initialReferrer = initialReferrer
        )
        visitorRepository.save(visitor)
        return ok().build()
    }
}
