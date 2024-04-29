package org.firstapproval.backend.core.domain.publication.downloader

import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface DownloaderRepository : JpaRepository<Downloader, UUID> {

    fun getByUserAndPublication(user: User, publication: Publication): Downloader?

    fun findAllByPublicationId(publicationId: String, pageable: Pageable): Page<Downloader>

    fun findAllByUserId(userId: UUID, pageable: Pageable): Page<Downloader>

    fun existsByUserIdAndPublication(userId: UUID, publication: Publication): Boolean
}
