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
class VisitorCounterController(
    private val visitorRepository: VisitorRepository,
) : VisitorApi {
    override fun saveVisit(utmSource: String?): ResponseEntity<Void> {
        val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes?)!!.request
        val visitor = Visitor(ip = request.remoteAddr, utmSource = utmSource)
        visitorRepository.save(visitor)
        return ok().build()
    }
}
