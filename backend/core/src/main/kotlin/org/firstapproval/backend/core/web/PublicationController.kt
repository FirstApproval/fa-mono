package org.firstapproval.backend.core.web

import org.firstapproval.api.server.PublicationApi
import org.firstapproval.api.server.model.AccessType
import org.firstapproval.api.server.model.CreatePublicationResponse
import org.firstapproval.api.server.model.DownloadLinkResponse
import org.firstapproval.api.server.model.GetDownloadersResponse
import org.firstapproval.api.server.model.Publication
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationStatus
import org.firstapproval.api.server.model.PublicationStatus.PUBLISHED
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.SearchPublicationsResponse
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.config.security.userOrNull
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.downloader.DownloaderRepository
import org.firstapproval.backend.core.domain.publication.toApiObject
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.annotation.RestController
import java.net.URLConnection
import java.util.UUID
import org.firstapproval.backend.core.domain.publication.AccessType as AccessTypeEntity

@RestController
class PublicationController(
    private val publicationService: PublicationService,
    private val userService: UserService,
    private val downloaderRepository: DownloaderRepository,
    private val ipfsClient: IpfsClient,
    private val authHolderService: AuthHolderService
) : PublicationApi {

    override fun getAllPublications(page: Int, pageSize: Int): ResponseEntity<PublicationsResponse> {
        return ok().body(publicationService.getAllPublications(page, pageSize))
    }

    override fun getUserPublications(
        username: String,
        status: PublicationStatus,
        page: Int,
        pageSize: Int
    ): ResponseEntity<PublicationsResponse> {
        if (status != PUBLISHED) {
            throw AccessDeniedException("Access denied")
        }
        val user = userService.getPublicUserProfile(username)
        val publications = publicationService.getCreatorPublications(user, status, page, pageSize)
        return ok().body(publications)
    }

    override fun getAllFeaturedPublications(page: Int, pageSize: Int): ResponseEntity<PublicationsResponse> {
        return ok().body(publicationService.getAllFeaturedPublications(page, pageSize))
    }

    override fun getMyPublications(
        status: PublicationStatus, page: Int, pageSize: Int
    ): ResponseEntity<PublicationsResponse> {
        val publications = publicationService.getCreatorPublications(authHolderService.user, status, page, pageSize)
        return ok().body(publications)
    }

    override fun createPublication(): ResponseEntity<CreatePublicationResponse> {
        val pub = publicationService.create(authHolderService.user)
        return ok().body(CreatePublicationResponse(pub.id, PublicationStatus.valueOf(pub.status.name), pub.creationTime.toOffsetDateTime()))
    }

    override fun submitPublication(id: UUID, accessType: AccessType): ResponseEntity<Void> {
        publicationService.submitPublication(authHolderService.user, id, AccessTypeEntity.valueOf(accessType.name))
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
                        dbModels
                            .first { it.id == elasticModel.id }
                            .toApiObject(userService)
                    }.toList()
                )
        )
    }

    override fun getPublication(id: UUID): ResponseEntity<Publication> {
        val pub = publicationService.get(authHolderService.userOrNull(), id)
//        val contentStatus = pub.contentId?.let { contentId ->
//            val publicationArchiveInfo = ipfsClient.getInfo(contentId)
//            publicationArchiveInfo.availability.let { PublicationContentStatus.valueOf(it.name) }
//        }
        val publicationResponse = pub.toApiObject(userService)//.contentStatus(contentStatus)
        return ok().body(publicationResponse)
    }

    override fun requestDownload(id: UUID): ResponseEntity<Void> {
        publicationService.requestDownload(id)
        return ok().build()
    }

    override fun getDownloadLink(id: UUID): ResponseEntity<DownloadLinkResponse> {
        val downloadLink = publicationService.getDownloadLink(authHolderService.user, id)
        return ok(downloadLink)
    }

    override fun downloadPublicationFiles(downloadToken: String): ResponseEntity<Resource> {
        val file = publicationService.getPublicationArchive(downloadToken)
        val contentType: MediaType = try {
            MediaType.parseMediaType(URLConnection.guessContentTypeFromName(file.name))
        } catch (ex: Exception) {
            MediaType.APPLICATION_OCTET_STREAM
        }
        return ok()
            .contentType(contentType)
            .header("Content-disposition", "attachment; filename=\"${file.name}\"")
            .contentLength(file.s3Object.objectMetadata.contentLength)
            .body(InputStreamResource(file.s3Object.objectContent))
    }

    override fun downloadPublicationSampleFiles(id: UUID): ResponseEntity<Resource> {
        val file = publicationService.getPublicationSamplesArchive(id)
        val contentType: MediaType = try {
            MediaType.parseMediaType(URLConnection.guessContentTypeFromName(file.name))
        } catch (ex: Exception) {
            MediaType.APPLICATION_OCTET_STREAM
        }
        return ok()
            .contentType(contentType)
            .header("Content-disposition", "attachment; filename=\"${file.name}\"")
            .contentLength(file.s3Object.objectMetadata.contentLength)
            .body(InputStreamResource(file.s3Object.objectContent))
    }

    override fun incrementPublicationViewCount(id: UUID): ResponseEntity<Void> {
        publicationService.incrementViewCount(id)
        return ok().build()
    }

    override fun editPublication(id: UUID, publicationEditRequest: PublicationEditRequest): ResponseEntity<Void> {
        publicationService.edit(authHolderService.user, id, publicationEditRequest)
        return ok().build()
    }

    override fun getPublicationDownloaders(id: UUID, page: Int, pageSize: Int): ResponseEntity<GetDownloadersResponse> {
        val downloadersPage = downloaderRepository.findAllByPublicationId(id, PageRequest.of(page, pageSize, Sort.by("id").descending()))
        val mappedDownloaders = downloadersPage.map { it.user.toApiObject(userService) }.toList()
        return ok(GetDownloadersResponse(downloadersPage.isLast, mappedDownloaders))
    }
}
