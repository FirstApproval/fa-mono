package org.firstapproval.backend.core.domain.publication.downloader

import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface DownloaderRepository: JpaRepository<Downloader, UUID> {

    fun getByUserAndPublication(user: User, publication: Publication): Downloader?
}
