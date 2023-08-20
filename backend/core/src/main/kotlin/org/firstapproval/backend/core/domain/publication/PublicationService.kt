package org.firstapproval.backend.core.domain.publication

import com.amazonaws.services.s3.model.S3ObjectInputStream
import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.backend.core.config.Properties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.ipfs.DownloadLink
import org.firstapproval.backend.core.domain.ipfs.DownloadLinkRepository
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.ipfs.Job
import org.firstapproval.backend.core.domain.ipfs.JobKind
import org.firstapproval.backend.core.domain.ipfs.JobRepository
import org.firstapproval.backend.core.domain.ipfs.JobStatus
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthor
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthorRepository
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.UnconfirmedUserRepository
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.elastic.PublicationElastic
import org.firstapproval.backend.core.elastic.PublicationElasticRepository
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.require
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.Publication as PublicationApiObject

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val unconfirmedUserRepository: UnconfirmedUserRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository,
    private val userRepository: UserRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient,
    private val elasticRepository: PublicationElasticRepository,
    private val tokenService: TokenService,
    private val frontendProperties: FrontendProperties,
    private val fileStorageService: FileStorageService
) {
    @Transactional
    fun create(user: User): Publication {
        val publication = publicationRepository.save(Publication(id = randomUUID(), creator = user))
        publication.confirmedAuthors =
            confirmedAuthorRepository.saveAll(mutableListOf(ConfirmedAuthor(randomUUID(), user, publication)))
        return publication
    }

    @Transactional
    fun edit(user: User, id: UUID, request: PublicationEditRequest) {
        val publication = get(user, id)
        checkAccessToPublication(user, publication)
        with(request) {
            val unconfirmedAuthorsEmails = unconfirmedAuthors?.let { unconfirmedAuthors.values.map { it.email }.toSet() } ?: setOf()
            if (unconfirmedAuthorsEmails.isNotEmpty() && userRepository.findByEmailIn(unconfirmedAuthorsEmails).isNotEmpty()) {
                throw RecordConflictException("User with this email already registered")
            }
            val confirmedAuthorsById =
                confirmedAuthors?.let { authors ->
                    userRepository.findAllById(authors.values.map { it.userId }).associateBy { it.id }
                } ?: mapOf()
            val confirmedAuthorsEmails = confirmedAuthorsById.values.map { { it.email } }

            if (confirmedAuthorsEmails.intersect(unconfirmedAuthorsEmails).isNotEmpty()) {
                throw RecordConflictException("Author with this email already added to publication as confirmed user")
            }

            if (title?.edited == true) publication.title = title.value
            if (description?.edited == true) publication.description = description.values.map { it.text }
            if (researchArea?.edited == true) publication.researchArea = researchArea.value
            if (grantOrganizations?.edited == true) publication.grantOrganizations = grantOrganizations.values.map { it.text }
            if (relatedArticles?.edited == true) publication.relatedArticles = relatedArticles.values.map { it.text }
            if (tags?.edited == true) publication.tags = tags.values.map { it.text }
            if (objectOfStudyTitle?.edited == true) publication.objectOfStudyTitle = objectOfStudyTitle.value
            if (objectOfStudyDescription?.edited == true) {
                publication.objectOfStudyDescription = objectOfStudyDescription.values.map { it.text }
            }
            if (software?.edited == true) publication.software = software.values.map { it.text }
            if (methodTitle?.edited == true) publication.methodTitle = methodTitle.value
            if (methodDescription?.edited == true) publication.methodDescription = methodDescription.values.map { it.text }
            if (predictedGoals?.edited == true) publication.predictedGoals = predictedGoals.values.map { it.text }
            if (confirmedAuthors?.edited == true) {
                if (confirmedAuthors.values.none { it.userId == publication.creator.id }) {
                    throw RecordConflictException("Creator cannot be deleted from authors list")
                }
                val confirmedAuthors = confirmedAuthors.values.map { confirmedAuthor ->
                    publication.confirmedAuthors.find { it.user.id == confirmedAuthor.userId }
                        ?.also { it.shortBio = confirmedAuthor.shortBio } ?: ConfirmedAuthor(
                        randomUUID(),
                        confirmedAuthorsById[confirmedAuthor.userId].require(),
                        publication,
                        confirmedAuthor.shortBio
                    )
                }
                publication.confirmedAuthors.clear()
                publication.confirmedAuthors.addAll(confirmedAuthors)
            }
            if (unconfirmedAuthors?.edited == true) {
                val unconfirmedCoauthorsList = unconfirmedUserRepository.saveAllAndFlush(unconfirmedAuthors.values
                    .map {
                        UnconfirmedUser(
                            id = randomUUID(),
                            email = it.email,
                            firstName = it.firstName,
                            middleName = it.middleName,
                            lastName = it.lastName,
                            shortBio = it.shortBio
                        )
                    }
                )
                publication.unconfirmedAuthors = unconfirmedCoauthorsList
            }
        }
        publicationRepository.saveAndFlush(publication)
    }

    @Transactional
    fun getPublicationArchive(token: String): FileResponse {
        val claims = tokenService.parseDownloadPublicationArchiveToken(token)
        val publicationId = claims["publicationId"].toString()
        val publication = publicationRepository.getReferenceById(UUID.fromString(publicationId))
        publication.downloadsCount += 1
        val title = if (publication.title != null) {
            publication.title
        } else {
            publicationId
        }
        return FileResponse(
            name = title!! + ".zip",
            fileStorageService.get(ARCHIVED_PUBLICATION_FILES, publicationId)
        )
    }

    @Transactional
    fun getPublicationSamplesArchive(id: UUID): FileResponse {
        val publication = publicationRepository.getReferenceById(id)
        val title = if (publication.title != null) {
            publication.title
        } else {
            id.toString()
        }
        return FileResponse(
            name = title!! + ".zip",
            s3Object = fileStorageService.get(ARCHIVED_PUBLICATION_SAMPLE_FILES, id.toString())
        )
    }

    @Transactional
    fun incrementViewCount(id: UUID) {
        val publication = publicationRepository.getReferenceById(id)
        publication.viewsCount += 1
    }

    @Transactional
    fun submitPublication(user: User, id: UUID, accessType: AccessType) {
        val publication = publicationRepository.getReferenceById(id)
        checkAccessToPublication(user, publication)
        publication.status = READY_FOR_PUBLICATION
        publication.accessType = accessType
    }

    fun search(text: String, limit: Int, pageNum: Int): Page<PublicationElastic> {
        val sort = Sort.by("_score").descending()
            .and(Sort.by("publicationTime").descending())
        return elasticRepository.searchByFields(text, PageRequest.of(pageNum, limit, sort))
    }

    @Transactional
    fun requestDownload(id: UUID) {
        val pub = getPublicationAndCheckStatus(id, PUBLISHED)
        jobRepository.findByPublicationId(pub.id) ?: run {
            val createdJob = ipfsClient.createJob(pub.contentId!!, IpfsClient.IpfsJobKind.RESTORE)
            jobRepository.save(
                Job(
                    id = createdJob.id,
                    publication = pub,
                    status = JobStatus.valueOf(createdJob.status.name),
                    kind = JobKind.valueOf(createdJob.kind.name),
                    creationTime = ZonedDateTime.now(),
                    completionTime = null
                )
            )
        }
    }

    fun getDownloadLink(user: User, publicationId: UUID): String {
        val publication = publicationRepository.getReferenceById(publicationId)
        if (publication.status != PUBLISHED) {
            throw IllegalArgumentException()
        }
        val downloadToken = tokenService.generateDownloadPublicationArchiveToken(user.id.toString(), publicationId.toString())
        return "${frontendProperties.url}/api/publication/files/download?downloadToken=$downloadToken"
    }

    private fun getPublicationAndCheckStatus(id: UUID, status: PublicationStatus): Publication {
        return publicationRepository.getReferenceById(id).let {
            if (it.status != status) {
                throw IllegalStateException("This publication is not published yet.")
            }
            it
        }
    }

    @Transactional
    fun get(user: User, id: UUID): Publication {
        val publication = publicationRepository.getReferenceById(id)
        if (publication.accessType != OPEN) {
            checkAccessToPublication(user, publication)
        }
        return publication
    }

    @Transactional(readOnly = true)
    fun getAllPublications(page: Int, pageSize: Int): PublicationsResponse {
        val publicationsPage = publicationRepository.findAll(PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime")))
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject() }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional(readOnly = true)
    fun getAllFeaturedPublications(page: Int, pageSize: Int): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByAccessTypeAndIsFeatured(
            AccessType.OPEN,
            true,
            PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
        )
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject() }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional
    fun getUserPublications(
        user: User,
        status: org.firstapproval.api.server.model.PublicationStatus,
        page: Int,
        pageSize: Int,
    ): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusAndCreatorId(
            PublicationStatus.valueOf(status.name),
            user.id,
            PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
        )

        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject() }.toList())
            .isLastPage(publicationsPage.isLast)
    }
}

fun Publication.toApiObject() = PublicationApiObject().also {
    it.id = id
    it.title = title
    it.description = description?.map { Paragraph(it) }
    it.researchArea = researchArea
    it.grantOrganizations = grantOrganizations?.map { Paragraph(it) }
    it.relatedArticles = relatedArticles?.map { Paragraph(it) }
    it.tags = tags?.map { Paragraph(it) }
    it.objectOfStudyTitle = objectOfStudyTitle
    it.objectOfStudyDescription = objectOfStudyDescription?.map { Paragraph(it) }
    it.software = software?.map { Paragraph(it) }
    it.methodTitle = methodTitle
    it.publicationTime = publicationTime?.toOffsetDateTime()
    it.methodDescription = methodDescription?.map { Paragraph(it) }
    it.predictedGoals = predictedGoals?.map { Paragraph(it) }
    it.authors = confirmedAuthors.map { author: ConfirmedAuthor ->
        Author(
            author.user.firstName,
            author.user.middleName,
            author.user.lastName,
            author.user.email,
            author.shortBio
        ).id(author.user.id.toString())
    } +
        unconfirmedAuthors.map { user -> Author(user.firstName, user.middleName, user.lastName, user.email, user.shortBio) }
    it.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    it.accessType = org.firstapproval.api.server.model.AccessType.valueOf(accessType.name)
    it.creationTime = creationTime.toOffsetDateTime()
}

fun PublicationElastic.toApiObject() = org.firstapproval.api.server.model.Publication().also { publicationApiModel ->
    publicationApiModel.id = id
    publicationApiModel.title = title
    publicationApiModel.description = description?.map { Paragraph(it) }
    publicationApiModel.grantOrganizations = grantOrganizations?.map { Paragraph(it) }
    publicationApiModel.relatedArticles = relatedArticles?.map { Paragraph(it) }
    publicationApiModel.tags = tags?.map { Paragraph(it) }
    publicationApiModel.objectOfStudyTitle = objectOfStudyTitle
    publicationApiModel.objectOfStudyDescription = objectOfStudyDescription?.map { Paragraph(it) }
    publicationApiModel.software = software?.map { Paragraph(it) }
    publicationApiModel.methodTitle = methodTitle
    publicationApiModel.publicationTime = publicationTime?.toOffsetDateTime()
    publicationApiModel.methodDescription = methodDescription?.map { Paragraph(it) }
    publicationApiModel.predictedGoals = predictedGoals?.map { Paragraph(it) }
    publicationApiModel.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    publicationApiModel.accessType = org.firstapproval.api.server.model.AccessType.valueOf(accessType!!.name)
    publicationApiModel.creationTime = creationTime.toOffsetDateTime()
}

fun Publication.toPublicationElastic() =
    PublicationElastic(
        id = id,
        creatorId = creator.id,
        status = status,
        accessType = accessType,
        title = title,
        description = description,
        grantOrganizations = grantOrganizations,
        relatedArticles = relatedArticles,
        tags = tags,
        objectOfStudyTitle = objectOfStudyTitle,
        objectOfStudyDescription = objectOfStudyDescription,
        software = software,
        methodTitle = methodTitle,
        methodDescription = methodDescription,
        predictedGoals = predictedGoals,
        creationTime = creationTime,
        publicationTime = publicationTime
    )
