package org.firstapproval.backend.core.domain.publication

import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.DownloadLinkResponse
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.domain.file.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.domain.file.FileStorageService
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.ipfs.Job
import org.firstapproval.backend.core.domain.ipfs.JobKind
import org.firstapproval.backend.core.domain.ipfs.JobRepository
import org.firstapproval.backend.core.domain.ipfs.JobStatus
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthor
import org.firstapproval.backend.core.domain.publication.authors.ConfirmedAuthorRepository
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthor
import org.firstapproval.backend.core.domain.publication.downloader.Downloader
import org.firstapproval.backend.core.domain.publication.downloader.DownloaderRepository
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.domain.user.UserService
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
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.ConfirmedAuthor as ConfirmedAuthorApiObject
import org.firstapproval.api.server.model.Publication as PublicationApiObject
import org.firstapproval.api.server.model.PublicationStatus as PublicationStatusApiObject
import org.firstapproval.api.server.model.UnconfirmedAuthor as UnconfirmedAuthorApiObject

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository,
    private val userRepository: UserRepository,
    private val userService: UserService,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient,
    private val elasticRepository: PublicationElasticRepository,
    private val tokenService: TokenService,
    private val frontendProperties: FrontendProperties,
    private val fileStorageService: FileStorageService,
    private val notificationService: NotificationService,
    private val downloaderRepository: DownloaderRepository
) {
    @Transactional
    fun create(user: User): Publication {
        val publication = publicationRepository.save(Publication(id = randomUUID(), creator = user))
        publication.confirmedAuthors =
            confirmedAuthorRepository.saveAll(mutableListOf(ConfirmedAuthor(randomUUID(), user, publication)))
        return publication
    }

    @Transactional(readOnly = true)
    fun findAllByIdIn(ids: List<UUID>) = publicationRepository.findAllByIdIn(ids)

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
            if (negativeData?.edited == true) publication.negativeData = negativeData.value
            if (isNegative != null) publication.isNegative = isNegative
            if (description?.edited == true) publication.description = description.values.map { it.text }
            if (researchArea?.edited == true) publication.researchArea = researchArea.value
            if (grantOrganizations?.edited == true) publication.grantOrganizations = grantOrganizations.values.map { it.text }
            if (primaryArticles?.edited == true) publication.primaryArticles = primaryArticles.values.map { it.text }
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
                val confirmedPublicationAuthors = confirmedAuthors.values.map { confirmedAuthor ->
                    ConfirmedAuthor(
                        id = confirmedAuthor.id ?: randomUUID(),
                        user = confirmedAuthorsById[confirmedAuthor.userId].require(),
                        publication = publication,
                        shortBio = confirmedAuthor.shortBio
                    )
                }
                publication.confirmedAuthors.clear()
                publication.confirmedAuthors.addAll(confirmedPublicationAuthors)
            }
            if (unconfirmedAuthors?.edited == true) {
                val unconfirmedPublicationAuthors = unconfirmedAuthors.values.map { unconfirmedAuthor ->
                    UnconfirmedAuthor(
                        id = unconfirmedAuthor.id ?: randomUUID(),
                        email = unconfirmedAuthor.email,
                        firstName = unconfirmedAuthor.firstName,
                        middleName = unconfirmedAuthor.middleName,
                        lastName = unconfirmedAuthor.lastName,
                        shortBio = unconfirmedAuthor.shortBio,
                        publication = publication
                    )
                }
                publication.unconfirmedAuthors.clear()
                publication.unconfirmedAuthors.addAll(unconfirmedPublicationAuthors)
            }
        }
        publicationRepository.saveAndFlush(publication)
    }

    @Transactional
    fun getPublicationArchive(token: String): FileResponse {
        val claims = tokenService.parseDownloadPublicationArchiveToken(token)
        val publicationId = claims.subject.toString()
        val publication = publicationRepository.getReferenceById(UUID.fromString(publicationId))
        val title = if (publication.title != null) {
            publication.title
        } else {
            publicationId
        }
        val user = userService.get(UUID.fromString(claims["userId"].toString()))
        publication.downloadsCount += 1
        addDownloadHistory(user, publication)
        notificationService.sendArchivePassword(user.email!!, publication.title, publication.archivePassword!!)
        return FileResponse(
            name = title!! + ".zip",
            fileStorageService.get(ARCHIVED_PUBLICATION_FILES, publicationId)
        )
    }

    private fun addDownloadHistory(user: User, publication: Publication) {
        val prevTry = downloaderRepository.getByUserAndPublication(user, publication)
        if (prevTry != null) {
            prevTry.history.add(now())
        } else {
            downloaderRepository.save(Downloader(publication = publication, user = user, history = mutableListOf(now())))
        }
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
        publication.creator.viewsCount += 1
    }

    @Transactional
    fun submitPublication(user: User, id: UUID, accessType: AccessType) {
        val publication = publicationRepository.getReferenceById(id)
        checkAccessToPublication(user, publication)
        if (publication.status == PUBLISHED) {
            throw IllegalArgumentException()
        }
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
                    creationTime = now(),
                    completionTime = null
                )
            )
        }
    }

    fun getDownloadLink(user: User, publicationId: UUID): DownloadLinkResponse {
        val publication = publicationRepository.getReferenceById(publicationId)
        if (publication.status != PUBLISHED && publication.accessType != OPEN) {
            throw IllegalArgumentException()
        }
        val downloadToken = tokenService.generateDownloadPublicationArchiveToken(user.id.toString(), publicationId.toString())
        val link = "${frontendProperties.url}/api/publication/files/download?downloadToken=$downloadToken"
        val passcode = publication.archivePassword
        return DownloadLinkResponse(link, passcode)
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
    fun get(user: User?, id: UUID): Publication {
        val publication = publicationRepository.getReferenceById(id)
        if (publication.accessType != OPEN) {
            checkAccessToPublication(user!!, publication)
        }
        return publication
    }

    @Transactional(readOnly = true)
    fun getAllPublications(page: Int, pageSize: Int): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusAndAccessType(
            PUBLISHED,
            OPEN,
            PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
        )
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService) }.toList())
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
            .publications(publicationsPage.map { it.toApiObject(userService) }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional
    fun getCreatorPublications(
        user: User,
        status: PublicationStatusApiObject,
        page: Int,
        pageSize: Int,
    ): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusAndCreatorId(
            PublicationStatus.valueOf(status.name),
            user.id,
            PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
        )

        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService) }.toList())
            .isLastPage(publicationsPage.isLast)
    }
}

fun Publication.toApiObject(userService: UserService) = PublicationApiObject().also { publicationApiModel ->
    publicationApiModel.id = id
    publicationApiModel.creator = UserInfo()
        .id(creator.id)
        .firstName(creator.firstName)
        .lastName(creator.lastName)
        .middleName(creator.middleName)
        .email(creator.email)
        .username(creator.username)
        .selfInfo(creator.selfInfo)
        .profileImage(userService.getProfileImage(creator.profileImage))
    publicationApiModel.title = title
    publicationApiModel.description = description?.map { Paragraph(it) }
    publicationApiModel.researchArea = researchArea
    publicationApiModel.grantOrganizations = grantOrganizations?.map { Paragraph(it) }
    publicationApiModel.primaryArticles = primaryArticles?.map { Paragraph(it) }
    publicationApiModel.relatedArticles = relatedArticles?.map { Paragraph(it) }
    publicationApiModel.tags = tags?.map { Paragraph(it) }
    publicationApiModel.objectOfStudyTitle = objectOfStudyTitle
    publicationApiModel.objectOfStudyDescription = objectOfStudyDescription?.map { Paragraph(it) }
    publicationApiModel.software = software?.map { Paragraph(it) }
    publicationApiModel.methodTitle = methodTitle
    publicationApiModel.publicationTime = publicationTime?.toOffsetDateTime()
    publicationApiModel.methodDescription = methodDescription?.map { Paragraph(it) }
    publicationApiModel.predictedGoals = predictedGoals?.map { Paragraph(it) }
    publicationApiModel.confirmedAuthors = confirmedAuthors.map { it.toApiObject(userService.getProfileImage(it.user.profileImage)) }
    publicationApiModel.unconfirmedAuthors = unconfirmedAuthors.map { it.toApiObject() }
    publicationApiModel.viewsCount = viewsCount
    publicationApiModel.downloadsCount = downloadsCount
    publicationApiModel.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    publicationApiModel.accessType = org.firstapproval.api.server.model.AccessType.valueOf(accessType.name)
    publicationApiModel.creationTime = creationTime.toOffsetDateTime()
    publicationApiModel.negativeData = negativeData
    publicationApiModel.isNegative = isNegative
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
        primaryArticles = primaryArticles,
        relatedArticles = relatedArticles,
        tags = tags,
        objectOfStudyTitle = objectOfStudyTitle,
        objectOfStudyDescription = objectOfStudyDescription,
        software = software,
        methodTitle = methodTitle,
        methodDescription = methodDescription,
        predictedGoals = predictedGoals,
        creationTime = creationTime,
        publicationTime = publicationTime,
        negativeData = negativeData,
        isNegative = isNegative
    )

fun ConfirmedAuthor.toApiObject(profileImage: ByteArray?) = ConfirmedAuthorApiObject().also {
    it.id = id
    it.shortBio = shortBio
    it.user = Author(
        user.id,
        user.firstName,
        user.middleName,
        user.lastName,
        user.email,
        user.username,
        user.selfInfo,
    ).profileImage(profileImage)
}

fun UnconfirmedAuthor.toApiObject() = UnconfirmedAuthorApiObject().also {
    it.id = id
    it.firstName = firstName
    it.lastName = lastName
    it.middleName = middleName
    it.email = email
    it.shortBio = shortBio
}
