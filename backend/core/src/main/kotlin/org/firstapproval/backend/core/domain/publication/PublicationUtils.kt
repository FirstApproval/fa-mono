package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.publication.PublicationStatus.MODERATION
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException

fun checkAccessToPublication(user: User?, publication: Publication) {
    if (publication.status in listOf(PENDING, MODERATION)) checkPublicationCreator(user!!, publication)
}

fun checkStatusPublished(publication: Publication) {
    if (publication.status != PUBLISHED) throw AccessDeniedException("Access denied")
}

fun checkPublicationCreator(user: User, publication: Publication) {
    if (user.id != publication.creator.id) throw AccessDeniedException("Access denied")
}
