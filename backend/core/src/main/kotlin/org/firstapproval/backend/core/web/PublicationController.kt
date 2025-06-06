package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.CreatePublicationRequest
import org.firstapproval.api.server.model.CreatePublicationResponse
import org.firstapproval.api.server.model.DownloadLinkResponse
import org.firstapproval.api.server.model.GetDownloadersResponse
import org.firstapproval.api.server.model.Publication
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationStatus
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.SearchPublicationsResponse
import org.firstapproval.api.server.model.SubmitPublicationRequest
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.DataCollectionType
import org.firstapproval.backend.core.domain.publication.PublicationPdfService
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.downloader.DownloaderRepository
import org.firstapproval.backend.core.domain.publication.toApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.Resource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.MediaType.APPLICATION_PDF
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController
import org.firstapproval.backend.core.domain.publication.Publication as PublicationEntity
import org.firstapproval.backend.core.domain.publication.PublicationStatus as PublicationStatusEntity

@RestController
class PublicationController(
    private val publicationService: PublicationService,
    private val userService: UserService,
    private val downloaderRepository: DownloaderRepository,
    private val authHolderService: AuthHolderService,
    private val publicationPdfService: PublicationPdfService,
    private val doiProperties: DoiProperties
) : PublicationApi {

    override fun getAllPublications(page: Int, pageSize: Int): ResponseEntity<PublicationsResponse> {
        return ok().body(publicationService.getAllPublications(page, pageSize))
    }

    override fun getAllFeaturedPublications(page: Int, pageSize: Int): ResponseEntity<PublicationsResponse> {
        return ok().body(publicationService.getAllFeaturedPublications(page, pageSize))
    }

    override fun getUserPublications(
        username: String,
        page: Int,
        pageSize: Int
    ): ResponseEntity<PublicationsResponse> {
        val user = userService.getPublicUserProfile(username)
        val publications = publicationService.getAuthorsPublications(
            user = user,
            page = page,
            pageSize = pageSize
        )
        return ok().body(publications)
    }

    override fun getMyPublications(page: Int, pageSize: Int, statuses: List<PublicationStatus>): ResponseEntity<PublicationsResponse> {
        val publications = publicationService.getCreatorPublications(
            user = authHolderService.user,
            statuses = statuses.map { PublicationStatusEntity.valueOf(it.name) },
            page = page,
            pageSize = pageSize
        )
        return ok().body(publications)
    }

    override fun createPublication(createPublicationRequest: CreatePublicationRequest): ResponseEntity<CreatePublicationResponse> {
        val pub = publicationService.create(
            user = authHolderService.user,
            dataCollectionType = DataCollectionType.valueOf(createPublicationRequest.dataCollectionType.name)
        )
        return ok().body(CreatePublicationResponse(pub.id, PublicationStatus.valueOf(pub.status.name), pub.creationTime.toOffsetDateTime()))
    }

    override fun submitPublication(id: String, submitPublicationRequest: SubmitPublicationRequest): ResponseEntity<Void> {
        publicationService.submitPublication(authHolderService.user, id, submitPublicationRequest)
        return ok().build()
    }

    override fun searchPublications(text: String, limit: Int, page: Int): ResponseEntity<SearchPublicationsResponse> {
        val pageResult = publicationService.search(text, limit, page)
        val dbModels = publicationService.findAllByIdIn(pageResult.content.map { it.id })
        return ok().body(
            SearchPublicationsResponse()
                .pageNum(pageResult.number)
                .isLast(pageResult.isLast)
                .items(
                    pageResult.map { elasticModel ->
                        dbModels.firstOrNull { it.id == elasticModel.id }?.toApiObject(userService, doiProperties)
                    }
                        .filterNotNull()
                        .toList()
                )
        )
    }

    override fun getPublication(id: String): ResponseEntity<Publication> {
        val pub = publicationService.get(authHolderService.user, id)
        val publicationResponse = pub.toApiObject(userService, doiProperties)
        return ok().body(publicationResponse)
    }

    override fun getPublicationPublic(id: String): ResponseEntity<Publication> {
        val pub = publicationService.getPublished(id)
        val publicationResponse = pub.toApiObject(userService, doiProperties)
        return ok().body(publicationResponse)
    }

    override fun getPublicationStatus(id: String): ResponseEntity<PublicationStatus> {
        val publication = publicationService.get(authHolderService.user, id)
        return ok(PublicationStatus.valueOf(publication.status.name))
    }

    override fun getDownloadLink(id: String): ResponseEntity<DownloadLinkResponse> {
        val downloadLink = publicationService.getDownloadLinkForArchive(authHolderService.user, id)
        return ok(downloadLink)
    }

    override fun getPublicationSampleFilesDownloadLink(id: String): ResponseEntity<DownloadLinkResponse> {
        val downloadLink = publicationService.getDownloadLinkForSampleArchive(id)
        return ok(downloadLink)
    }

    override fun incrementPublicationViewCount(id: String): ResponseEntity<Void> {
        publicationService.incrementViewCount(id)
        return ok().build()
    }

    override fun editPublication(id: String, publicationEditRequest: PublicationEditRequest): ResponseEntity<Void> {
        publicationService.edit(authHolderService.user, id, publicationEditRequest)
        return ok().build()
    }

    override fun getPublicationDownloaders(id: String, page: Int, pageSize: Int): ResponseEntity<GetDownloadersResponse> {
        val downloadersPage = downloaderRepository.findAllByPublicationId(id, PageRequest.of(page, pageSize, Sort.by("id").descending()))
        val mappedDownloaders = downloadersPage.map { it.user.toApiObject(userService) }.toList()
        return ok(GetDownloadersResponse(downloadersPage.isLast, mappedDownloaders))
    }

    override fun delete(id: String): ResponseEntity<Void> {
        publicationService.delete(id, authHolderService.user)
        return ok().build()
    }

    override fun downloadPdf(id: String): ResponseEntity<Resource> {
        val publication = publicationService.getPublished(id)
        return downloadPdf(publication)
    }

    override fun downloadPendingPdf(id: String): ResponseEntity<Resource> {
        val publication = publicationService.get(authHolderService.user, id)
        return downloadPdf(publication)
    }

    private fun downloadPdf(publication: PublicationEntity): ResponseEntity<Resource> {
        val pdfContent = publicationPdfService.generate(publication)
        return ok()
            .contentType(APPLICATION_PDF)
            .header("Content-disposition", "attachment; filename=\"${publication.title ?: publication.id}.pdf\"")
            .contentLength(pdfContent.size.toLong())
            .body(ByteArrayResource(pdfContent))
    }
}
