package org.firstapproval.backend.core.external.ipfs

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "ipfs_restore_requests")
class RestoreRequest(
    @Id
    var id: UUID = randomUUID(),
    var publicationId: String,
    @OneToOne
    var user: User,
    var contentId: Long,
    var creationTime: ZonedDateTime = now(),
    var completionTime: ZonedDateTime? = null
)
