package org.firstapproval.backend.core.domain.publication.authors

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import jakarta.persistence.Table
import java.io.Serializable
import java.util.UUID

@Entity
@Table(name = "publication_unconfirmed_authors")
@IdClass(UnconfirmedAuthorPK::class)
class UnconfirmedAuthor (
    @Id
    @Column(name = "publication_id")
    var publicationId: UUID,
    @Id
    @Column(name = "user_id")
    var userId: UUID
)

class UnconfirmedAuthorPK : Serializable {
    lateinit var publicationId: UUID
    lateinit var userId: UUID
}
