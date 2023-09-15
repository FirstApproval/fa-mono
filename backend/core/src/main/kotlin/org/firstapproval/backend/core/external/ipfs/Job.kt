package org.firstapproval.backend.core.external.ipfs

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import java.time.ZonedDateTime

@Entity
@Table(name = "jobs")
class Job(
    @Id
    var id: Long,
    @ManyToOne
    var publication: Publication,
    var status: JobStatus,
    var kind: JobKind,
    var creationTime: ZonedDateTime,
    var completionTime: ZonedDateTime? = null
)

enum class JobStatus {
    CREATED,
    ACCEPTED,
    REJECTED,
    INPROGRESS,
    CANCELLED,
    FAILED,
    COMPLETE
}

enum class JobKind {
    ENCRYPT,
    DECRYPT,
    REPLICATE,
    RESTORE
}
