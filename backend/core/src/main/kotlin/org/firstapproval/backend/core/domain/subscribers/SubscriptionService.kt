package org.firstapproval.backend.core.domain.subscribers

import org.springframework.stereotype.Service

@Service
class SubscriptionService(private val subscriberRepository: SubscriberRepository) {
    fun create(subscriber: Subscriber) = subscriberRepository.save(subscriber)
}
