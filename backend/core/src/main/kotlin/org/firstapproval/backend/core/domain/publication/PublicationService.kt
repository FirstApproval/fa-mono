package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.user.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID.*

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
) {
    @Transactional
    fun createDraft(user: User): Publication {
        return publicationRepository.save(Publication(id = randomUUID(), author = user))
    }
}
