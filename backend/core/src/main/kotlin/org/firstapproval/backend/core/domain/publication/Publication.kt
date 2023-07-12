package org.firstapproval.backend.core.domain.publication

import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.user.User
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.*

@Entity
@Table(name = "publications")
class Publication(
    @Id
    var id: UUID,
    @ManyToOne
    val author: User,
    @Enumerated(STRING)
    var status: PublicationStatus = PENDING,
    var creationTime: ZonedDateTime = now(),
    var publicationTime: ZonedDateTime? = null,
    var contentId: Long? = null,
)

enum class PublicationStatus {
    PENDING,
    READY_FOR_PUBLICATION,
    PUBLISHED
}
