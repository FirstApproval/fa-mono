package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.user.User
import org.springframework.security.access.AccessDeniedException

fun checkAccessToPublication(user: User, publication: Publication) {
    if (user.id != publication.author.id) {
        throw AccessDeniedException("Access denied")
    }
}
