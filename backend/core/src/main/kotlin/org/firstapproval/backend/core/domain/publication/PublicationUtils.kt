package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException

fun checkAccessToPublication(user: User?, publication: Publication) {
    if (publication.accessType != OPEN || publication.status == PENDING) {
        checkPublicationCreator(user!!, publication)
    }
}

fun checkStatusAndAccessType(publication: Publication) {
    if (publication.status != PUBLISHED && publication.accessType != OPEN) {
        throw IllegalArgumentException()
    }
}

fun checkPublicationCreator(user: User, publication: Publication) {
    if (user.id != publication.creator.id) {
        throw AccessDeniedException("Access denied")
    }
}
