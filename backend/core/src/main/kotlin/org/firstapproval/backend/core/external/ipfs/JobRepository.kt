package org.firstapproval.backend.core.external.ipfs

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime
import java.util.UUID

interface JobRepository : JpaRepository<Job, Long> {
    fun findAllByStatusNot(status: JobStatus): List<Job>

    fun findByPublicationId(publicationId: UUID): Job?

    @Query(
        """update Job j set j.completionTime = :completionTime, j.status = 'COMPLETE'
           where j.id IN :ids AND j.status != 'COMPLETE'"""
    )
    fun updateStatusAndCompletionTime(completionTime: LocalDateTime, ids: Collection<Long>)
}
