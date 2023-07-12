package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.Publication
import org.firstapproval.api.server.model.PublicationContentStatus
import org.firstapproval.api.server.model.PublicationStatus
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class PublicationController(
    private val publicationService: PublicationService,
    private val publicationRepository: PublicationRepository,
    private val ipfsClient: IpfsClient,
    private val authHolderService: AuthHolderService
) : PublicationApi {
    override fun createPublication(): ResponseEntity<Publication> {
        val pub = publicationService.createDraft(authHolderService.user)
        return ok().body(Publication(pub.id, PublicationStatus.valueOf(pub.status.name), pub.creationTime.toOffsetDateTime()))
    }

    override fun submitPublication(id: UUID): ResponseEntity<Void> {
        publicationService.submitPublication(authHolderService.user, id)
        return ok().build()
    }

    override fun getPublication(id: UUID): ResponseEntity<Publication> {
        val pub = publicationRepository.getReferenceById(id)
        val contentStatus = pub.contentId?.let { contentId ->
            val publicationArchiveInfo = ipfsClient.getInfo(contentId)
            publicationArchiveInfo.availability.let { PublicationContentStatus.valueOf(it.name) }
        }
        val publicationResponse = Publication(pub.id, PublicationStatus.valueOf(pub.status.name), pub.creationTime.toOffsetDateTime())
            .contentStatus(contentStatus)
        return ok().body(publicationResponse)
    }

    override fun requestDownload(id: UUID): ResponseEntity<Void> {
        publicationService.requestDownload(id)
        return ok().build()
    }

    override fun getDownloadLink(id: UUID): ResponseEntity<String> {
        val downloadLink = publicationService.getDownloadLink(id)
        return ok().body(downloadLink.url)
    }
}
