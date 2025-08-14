package org.firstapproval.backend.core.web

import org.firstapproval.api.server.SubscriptionApi
import org.firstapproval.api.server.model.SubscribeRequest
import org.firstapproval.backend.core.domain.subscribers.Subscriber
import org.firstapproval.backend.core.domain.subscribers.SubscriptionService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class SubscriberController(val subscriptionService: SubscriptionService) : SubscriptionApi {
    override fun subscribe(subscribeRequest: SubscribeRequest): ResponseEntity<Void> {
        subscriptionService.create(Subscriber(subscribeRequest.email))
        return ok().build()
    }
}
