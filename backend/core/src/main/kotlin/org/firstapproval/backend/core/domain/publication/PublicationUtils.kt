package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException

fun checkAccessToPublication(user: User, publication: Publication) {
    if (publication.confirmedAuthors.filter { it.id == user.id }.size != 1) {
        throw AccessDeniedException("Access denied")
    }
}
