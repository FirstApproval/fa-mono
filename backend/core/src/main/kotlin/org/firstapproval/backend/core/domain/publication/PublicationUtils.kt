package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException

fun checkAccessToPublication(user: User?, publication: Publication) {
    if (publication.accessType != OPEN && publication.status != PUBLISHED) {
        checkPublicationCreator(user!!, publication)
    }
}

fun checkPublicationCreator(user: User, publication: Publication) {
    if (user.id != publication.creator.id) {
        throw AccessDeniedException("Access denied")
    }
}
