package org.firstapproval.backend.core.domain.publication

import org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric
import org.firstapproval.api.server.model.DownloadLinkResponse
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.config.Properties.S3Properties
import org.firstapproval.backend.core.domain.auth.TokenService
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.organizations.OrganizationService
import org.firstapproval.backend.core.domain.organizations.UnconfirmedAuthorWorkplace
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
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
import org.firstapproval.backend.core.external.ipfs.IpfsClient
import org.firstapproval.backend.core.external.ipfs.JobRepository
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.external.s3.FILES
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.SAMPLE_FILES
import org.firstapproval.backend.core.infra.elastic.PublicationElastic
import org.firstapproval.backend.core.infra.elastic.PublicationElasticRepository
import org.firstapproval.backend.core.utils.require
import org.firstapproval.backend.core.web.errors.RecordConflictException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionTemplate
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.AccessType as AccessTypeApiObject
import org.firstapproval.api.server.model.ConfirmedAuthor as ConfirmedAuthorApiObject
import org.firstapproval.api.server.model.LicenseType as LicenseTypeApiObject
import org.firstapproval.api.server.model.Publication as PublicationApiObject
import org.firstapproval.api.server.model.PublicationStatus as PublicationStatusApiObject
import org.firstapproval.api.server.model.UnconfirmedAuthor as UnconfirmedAuthorApiObject

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository,
    private val userRepository: UserRepository,
    private val userService: UserService,
    private val organizationService: OrganizationService,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient,
    private val elasticRepository: PublicationElasticRepository,
    private val tokenService: TokenService,
    private val frontendProperties: FrontendProperties,
    private val fileStorageService: FileStorageService,
    private val notificationService: NotificationService,
    private val downloaderRepository: DownloaderRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val sampleFileRepository: PublicationSampleFileRepository,
    private val transactionTemplate: TransactionTemplate,
    private val s3Properties: S3Properties
) {
    @Transactional
    fun create(user: User): Publication {
        val publication = publicationRepository.save(Publication(id = generateCode(), creator = user))
        publication.confirmedAuthors =
            confirmedAuthorRepository.saveAll(mutableListOf(ConfirmedAuthor(randomUUID(), user, publication)))
        return publication
    }

    @Transactional(readOnly = true)
    fun findAllByIdIn(ids: List<String>) = publicationRepository.findAllByIdInAndStatus(ids, PUBLISHED)

    @Transactional
    fun edit(user: User, id: String, request: PublicationEditRequest) {
        val publication = get(user, id)
        checkPublicationCreator(user, publication)
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

            publication.editingTime = now()
            if (title?.edited == true) publication.title = title.value
            if (negativeData?.edited == true) publication.negativeData = negativeData.value
            if (isNegative != null) publication.isNegative = isNegative
            if (description?.edited == true) publication.description = description.values.map { it.text }
            if (researchAreas?.edited == true) publication.researchAreas = researchAreas.values.map { it.text }
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
            if (licenseType?.edited == true) publication.licenseType = LicenseType.valueOf(licenseType.value.name)
            if (confirmedAuthors?.edited == true) {
                if (confirmedAuthors.values.none { it.userId == publication.creator.id }) {
                    throw RecordConflictException("Creator cannot be deleted from authors list")
                }
                val confirmedPublicationAuthors = confirmedAuthors.values.map { confirmedAuthor ->
                    ConfirmedAuthor(
                        id = confirmedAuthor.id ?: randomUUID(),
                        user = confirmedAuthorsById[confirmedAuthor.userId].require(),
                        publication = publication,
                    )
                }
                publication.confirmedAuthors.clear()
                publication.confirmedAuthors.addAll(confirmedPublicationAuthors)
            }
            if (unconfirmedAuthors?.edited == true) {
                val unconfirmedPublicationAuthors = unconfirmedAuthors.values.map { unconfirmedAuthorApiObject ->
                    val unconfirmedAuthor = UnconfirmedAuthor(
                        id = unconfirmedAuthorApiObject.id ?: randomUUID(),
                        email = unconfirmedAuthorApiObject.email,
                        firstName = unconfirmedAuthorApiObject.firstName,
                        middleName = unconfirmedAuthorApiObject.middleName,
                        lastName = unconfirmedAuthorApiObject.lastName,
                        publication = publication
                    )

                    unconfirmedAuthor.workplaces = unconfirmedAuthorApiObject.workplaces.map { unconfirmedWorkplace ->
                        val organization = organizationService.getOrSave(unconfirmedWorkplace.organization)
                        val organizationDepartment = organizationService.getOrSave(unconfirmedWorkplace.department, organization)
                        UnconfirmedAuthorWorkplace(
                            id = unconfirmedWorkplace.id ?: randomUUID(),
                            organization = organization,
                            organizationDepartment = organizationDepartment,
                            unconfirmedAuthor = unconfirmedAuthor,
                            address = unconfirmedWorkplace.address,
                            postalCode = unconfirmedWorkplace.postalCode,
                            isFormer = unconfirmedWorkplace.isFormer,
                            creationTime = unconfirmedWorkplace.creationTime?.toZonedDateTime() ?: now(),
                            editingTime = now()
                        )
                    }.toMutableList()
                    unconfirmedAuthor
                }
                publication.unconfirmedAuthors.clear()
                publicationRepository.saveAndFlush(publication)
                publication.unconfirmedAuthors.addAll(unconfirmedPublicationAuthors)
            }
        }
        publicationRepository.saveAndFlush(publication)
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
    fun getPublicationSamplesArchive(id: String): FileResponse {
        val publication = publicationRepository.getReferenceById(id)
        val title = if (publication.title != null) {
            publication.title
        } else {
            publication.id.toString()
        }
        return FileResponse(
            name = title!! + ".zip",
            s3Object = fileStorageService.get(ARCHIVED_PUBLICATION_SAMPLE_FILES, publication.id.toString())
        )
    }

    @Transactional
    fun incrementViewCount(id: String) {
        val publication = publicationRepository.getReferenceById(id)
        publication.viewsCount += 1
        publication.creator.viewsCount += 1
    }

    @Transactional
    fun submitPublication(user: User, id: String, accessType: AccessType) {
        val publication = publicationRepository.getReferenceById(id)
        checkPublicationCreator(user, publication)
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
    fun getDownloadLinkForArchive(user: User, id: String): DownloadLinkResponse {
        val publication = publicationRepository.getReferenceById(id)
        if (publication.status != PUBLISHED && publication.accessType != OPEN) {
            throw IllegalArgumentException()
        }
        val title = if (publication.title != null) {
            publication.title
        } else {
            id
        }
        publication.downloadsCount += 1
        addDownloadHistory(user, publication)
        if (user.email != null) {
            notificationService.sendArchivePassword(user.email!!, title, publication.archivePassword!!)
        }
        val link = fileStorageService.generateTemporaryDownloadLink(
            ARCHIVED_PUBLICATION_FILES, publication.id.toString(), title!! + "_files.zip"
        )
        val passcode = publication.archivePassword
        return DownloadLinkResponse(link, passcode)
    }

    @Transactional
    fun getDownloadLinkForSampleArchive(publicationId: String): DownloadLinkResponse {
        val publication = publicationRepository.getReferenceById(publicationId)
        if (publication.status != PUBLISHED && publication.accessType != OPEN) {
            throw IllegalArgumentException()
        }
        val title = if (publication.title != null) {
            publication.title
        } else {
            publicationId
        }
        val link =
            fileStorageService.generateTemporaryDownloadLink(
                ARCHIVED_PUBLICATION_SAMPLE_FILES,
                publication.id.toString(),
                title!! + "_sample_files.zip"
            )
        val passcode = publication.archivePassword
        return DownloadLinkResponse(link, passcode)
    }

    @Transactional(readOnly = true)
    fun get(user: User?, id: String): Publication {
        val publication = publicationRepository.getReferenceById(id)
        checkAccessToPublication(user, publication)
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
        val publicationsPage = publicationRepository.findAllByStatusAndAccessTypeAndIsFeatured(
            PUBLISHED,
            OPEN,
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
        val publicationsPage = if (PublicationStatus.valueOf(status.name) == PUBLISHED) {
            publicationRepository.findAllPublishedPublicationsByAuthorId(
                user.id,
                PageRequest.of(page, pageSize)
            )
        } else {
            publicationRepository.findAllByStatusAndAccessTypeAndCreatorId(
                PublicationStatus.valueOf(status.name),
                OPEN,
                user.id,
                PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
            )
        }

        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService) }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional
    fun getAuthorsPublications(
        user: User,
        status: PublicationStatusApiObject,
        page: Int,
        pageSize: Int,
    ): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllAuthorPublications(
            status.name,
            OPEN.name,
            user.id,
            PageRequest.of(page, pageSize)
        )
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService) }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    fun delete(id: String, user: User) {
        val publicationFilesIds = mutableListOf<UUID>()
        val publicationSampleFilesIds = mutableListOf<UUID>()
        transactionTemplate.execute { _ ->
            val publication = publicationRepository.getReferenceById(id)
            checkPublicationCreator(user, publication)
            if (publication.status != PENDING) {
                throw AccessDeniedException("Forbidden delete published publications. Only draft publications can be deleted")
            }
            publicationFilesIds.addAll(publicationFileRepository.findIdsByPublicationId(id))
            publicationSampleFilesIds.addAll(sampleFileRepository.findIdsByPublicationId(id))
            publicationFileRepository.deleteAllById(publicationFilesIds)
            sampleFileRepository.deleteAllById(publicationSampleFilesIds)
            publicationRepository.deleteById(id)
        }
        if (publicationFilesIds.isNotEmpty()) {
            fileStorageService.deleteByIds(FILES, publicationFilesIds)
        }
        if (publicationSampleFilesIds.isNotEmpty()) {
            fileStorageService.deleteByIds(SAMPLE_FILES, publicationSampleFilesIds)
        }
    }

    private fun generateCode(): String {
        val id = randomAlphanumeric(7).uppercase();
        return if (publicationRepository.existsById(id)) {
            generateCode()
        } else {
            id
        }
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
        .workplaces(creator.workplaces.map { it.toApiObject() })
        .profileImage(userService.getProfileImage(creator.profileImage))
    publicationApiModel.title = title
    publicationApiModel.description = description?.map { Paragraph(it) }
    publicationApiModel.researchAreas = researchAreas?.map { Paragraph(it) }
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
    publicationApiModel.status = PublicationStatusApiObject.valueOf(status.name)
    publicationApiModel.accessType = AccessTypeApiObject.valueOf(accessType.name)
    publicationApiModel.licenseType = licenseType?.let { LicenseTypeApiObject.valueOf(it.name) }
    publicationApiModel.creationTime = creationTime.toOffsetDateTime()
    publicationApiModel.editingTime = editingTime.toOffsetDateTime()
    publicationApiModel.negativeData = negativeData
    publicationApiModel.archiveSize = archiveSize
    publicationApiModel.sampleArchiveSize = archiveSampleSize
    publicationApiModel.isNegative = isNegative
}

fun Publication.toPublicationElastic() =
    PublicationElastic(
        id = id,
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
    )

fun ConfirmedAuthor.toApiObject(profileImage: ByteArray?) = ConfirmedAuthorApiObject().also {
    it.id = id
    it.user = UserInfo(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.username,
        user.workplaces.map { workplace -> workplace.toApiObject() }
    )
        .middleName(user.middleName)
        .profileImage(profileImage)
}

fun UnconfirmedAuthor.toApiObject() = UnconfirmedAuthorApiObject().also {
    it.id = id
    it.firstName = firstName
    it.lastName = lastName
    it.middleName = middleName
    it.email = email
    it.workplaces = workplaces.map { workplace -> workplace.toApiObject() }
}
