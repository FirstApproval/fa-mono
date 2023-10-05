package org.firstapproval.backend.core.external.ipfs

import org.springframework.data.jpa.repository.JpaRepository

interface RestoreRequestRepository : JpaRepository<RestoreRequest, String> {
    fun findAllByCompletionTimeIsNull(): List<RestoreRequest>
    fun findByPublicationIdAndCompletionTimeIsNull(publicationId: String): RestoreRequest?
}
