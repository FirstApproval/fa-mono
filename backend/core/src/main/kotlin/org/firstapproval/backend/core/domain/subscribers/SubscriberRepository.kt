package org.firstapproval.backend.core.domain.subscribers

import org.springframework.data.jpa.repository.JpaRepository

interface SubscriberRepository : JpaRepository<Subscriber, String>
