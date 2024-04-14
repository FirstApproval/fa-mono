package org.firstapproval.backend.core.domain.publication.collaborator

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.FetchType.EAGER
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "collaborators")
class Collaborator(
    @Id
    var id: UUID = randomUUID(),
    @ManyToOne(fetch = EAGER)
    val publication: Publication,
    @ManyToOne(fetch = EAGER)
    val user: User,
    val creationTime: ZonedDateTime = ZonedDateTime.now()
)

fun Collaborator.toApiObject(userService: UserService) = org.firstapproval.api.server.model.CollaboratorInfo().also {
    it.id = id
    it.userInfo = user.toApiObject(userService)
    it.creationTime = creationTime.toOffsetDateTime()
}
