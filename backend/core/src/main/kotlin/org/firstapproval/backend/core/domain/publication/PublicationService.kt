package org.firstapproval.backend.core.domain.publication

import org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric
import org.firstapproval.api.server.model.DownloadLinkResponse
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationContentStatus.AVAILABLE
import org.firstapproval.api.server.model.PublicationContentStatus.PREPARING
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.SubmitPublicationRequest
import org.firstapproval.api.server.model.UseType.CO_AUTHORSHIP
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.domain.notification.NotificationService
import org.firstapproval.backend.core.domain.organizations.OrganizationService
import org.firstapproval.backend.core.domain.organizations.toApiObject
import org.firstapproval.backend.core.domain.publication.AccessType.OPEN
import org.firstapproval.backend.core.domain.publication.DataCollectionType.STUDENT
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.publication.StorageType.CLOUD_SECURE_STORAGE
import org.firstapproval.backend.core.domain.publication.StorageType.IPFS
import org.firstapproval.backend.core.domain.publication.authors.Author
import org.firstapproval.backend.core.domain.publication.authors.AuthorRepository
import org.firstapproval.backend.core.domain.publication.authors.AuthorWorkplace
import org.firstapproval.backend.core.domain.publication.authors.toApiObject
import org.firstapproval.backend.core.domain.publication.downloader.Downloader
import org.firstapproval.backend.core.domain.publication.downloader.DownloaderRepository
import org.firstapproval.backend.core.domain.publication.file.PublicationFileRepository
import org.firstapproval.backend.core.domain.publication.file.PublicationSampleFileRepository
import org.firstapproval.backend.core.domain.publication.reviewers.Reviewer
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.external.ipfs.DownloadLink
import org.firstapproval.backend.core.external.ipfs.DownloadLinkRepository
import org.firstapproval.backend.core.external.ipfs.IpfsClient.IpfsContentAvailability.ARCHIVE
import org.firstapproval.backend.core.external.ipfs.IpfsClient.IpfsContentAvailability.INSTANT
import org.firstapproval.backend.core.external.ipfs.IpfsStorageService
import org.firstapproval.backend.core.external.ipfs.RestoreRequest
import org.firstapproval.backend.core.external.ipfs.RestoreRequestRepository
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_FILES
import org.firstapproval.backend.core.external.s3.ARCHIVED_PUBLICATION_SAMPLE_FILES
import org.firstapproval.backend.core.external.s3.FILES
import org.firstapproval.backend.core.external.s3.FileStorageService
import org.firstapproval.backend.core.external.s3.SAMPLE_FILES
import org.firstapproval.backend.core.infra.elastic.PublicationElastic
import org.firstapproval.backend.core.infra.elastic.PublicationElasticRepository
import org.firstapproval.backend.core.utils.allUniqueBy
import org.firstapproval.backend.core.utils.require
import org.firstapproval.backend.core.web.errors.RecordConflictException
import org.springframework.data.domain.Page
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
import org.firstapproval.api.server.model.Author as AuthorApiObject
import org.firstapproval.api.server.model.DataCollectionType as DataCollectionTypeApiObject
import org.firstapproval.api.server.model.LicenseType as LicenseTypeApiObject
import org.firstapproval.api.server.model.Publication as PublicationApiObject
import org.firstapproval.api.server.model.AcademicLevel as AcademicLevelApiObject
import org.firstapproval.api.server.model.PublicationStatus as PublicationStatusApiObject
import org.firstapproval.api.server.model.UseType as UseTypeApiObject

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val authorRepository: AuthorRepository,
    private val userRepository: UserRepository,
    private val userService: UserService,
    private val organizationService: OrganizationService,
    private val restoreRequestRepository: RestoreRequestRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val ipfsStorageService: IpfsStorageService,
    private val elasticRepository: PublicationElasticRepository,
    private val fileStorageService: FileStorageService,
    private val notificationService: NotificationService,
    private val downloaderRepository: DownloaderRepository,
    private val publicationFileRepository: PublicationFileRepository,
    private val sampleFileRepository: PublicationSampleFileRepository,
    private val transactionTemplate: TransactionTemplate,
    private val doiProperties: DoiProperties
) {
    @Transactional
    fun create(user: User, dataCollectionType: DataCollectionType): Publication {
        val publication = publicationRepository.save(
            Publication(
                id = generateCode(),
                creator = user,
                dataCollectionType = dataCollectionType
            )
        )
        publication.authors =
            authorRepository.saveAll(
                mutableListOf(
                    Author(
                        publication = publication,
                        email = user.email,
                        firstName = user.firstName,
                        lastName = user.lastName,
                        ordinal = 0,
                        user = user,
                        isConfirmed = true,
                        workplaces = user.workplaces.map {
                            AuthorWorkplace(
                                organization = it.organization,
                                organizationDepartment = it.organizationDepartment,
                                address = it.address,
                                postalCode = it.postalCode,
                                creationTime = now(),
                                editingTime = now(),
                            )
                        }.toMutableList()
                    )
                )
            )
        return publication
    }

    @Transactional(readOnly = true)
    fun findAllByIdIn(ids: List<String>) =
        publicationRepository.findAllByIdInAndStatusAndIsBlockedIsFalseAndAccessType(ids, PUBLISHED, OPEN)

    @Transactional
    fun edit(user: User, id: String, request: PublicationEditRequest) {
        val publication = get(user, id)
        checkPublicationCreator(user, publication)
        if (publication.status == PUBLISHED) {
            throw AccessDeniedException("Access denied")
        }
        with(request) {
            val isAuthorsEmailsUnique = authors?.values?.allUniqueBy { it.email } ?: true
            if (!isAuthorsEmailsUnique) {
                throw RecordConflictException("Authors emails not unique")
            }

            val unconfirmedAuthorsEmails = authors?.values?.filter { it.isConfirmed == false }?.map { it.email }?.toSet() ?: setOf()
            if (unconfirmedAuthorsEmails.isNotEmpty() && userRepository.findByEmailIn(unconfirmedAuthorsEmails).isNotEmpty()) {
                throw RecordConflictException("User with this email already registered")
            }

            publication.editingTime = now()
            if (title?.edited == true) publication.title = title.value
            if (negativeData?.edited == true) publication.negativeData = negativeData.value
            if (isNegative != null) publication.isNegative = isNegative
            if (isReplicationOfPreviousExperiments != null) publication.isReplicationOfPreviousExperiments =
                isReplicationOfPreviousExperiments
            if (replicationOfPreviousExperimentsData?.edited == true) publication.replicationOfPreviousExperimentsData =
                replicationOfPreviousExperimentsData.value
            if (isPreviouslyPublishedDataset != null) publication.isPreviouslyPublishedDataset = isPreviouslyPublishedDataset
            if (previouslyPublishedDatasetData?.edited == true) publication.previouslyPublishedDatasetData = previouslyPublishedDatasetData.value
            if (description?.edited == true) publication.description = description.value
            if (researchAreas?.edited == true) publication.researchAreas = researchAreas.values.map { it.text }
            if (grantOrganizations?.edited == true) publication.grantOrganizations = grantOrganizations.values.map { it.text }
            if (primaryArticles?.edited == true) publication.primaryArticles = primaryArticles.values.map { it.text }
            if (relatedArticles?.edited == true) publication.relatedArticles = relatedArticles.values.map { it.text }
            if (tags?.edited == true) publication.tags = tags.values.map { it.text }
            if (dataDescription?.edited == true) publication.dataDescription = dataDescription.value
            if (preliminaryResults?.edited == true) publication.preliminaryResults = preliminaryResults.value
            if (software?.edited == true) publication.software = software.value
            if (methodTitle?.edited == true) publication.methodTitle = methodTitle.value
            if (methodDescription?.edited == true) publication.methodDescription = methodDescription.value
            if (predictedGoals?.edited == true) publication.predictedGoals = predictedGoals.value
            if (academicLevel != null) publication.academicLevel = AcademicLevel.valueOf(academicLevel.name)
            if (licenseType?.edited == true) publication.licenseType = LicenseType.valueOf(licenseType.value.name)
            if (dataCollectionType?.edited == true) {
                publication.dataCollectionType = DataCollectionType.valueOf(dataCollectionType.value.name)
            }
            if (authors?.edited == true) {
                val unconfirmedPublicationAuthors = authors.values.map { authorApiObject ->
                    val authorUser = if (authorApiObject.isConfirmed) authorApiObject.user.require().let {
                        userRepository.getReferenceById(it.id)
                    } else null
                    Author(
                        id = authorApiObject.id ?: randomUUID(),
                        email = authorApiObject.email,
                        firstName = authorApiObject.firstName,
                        lastName = authorApiObject.lastName,
                        ordinal = authorApiObject.ordinal,
                        user = authorUser,
                        publication = publication,
                        isConfirmed = authorApiObject.isConfirmed,
                        workplaces = authorApiObject.workplaces.map { unconfirmedWorkplace ->
                            val organization = organizationService.getOrSave(unconfirmedWorkplace.organization)
                            AuthorWorkplace(
                                id = unconfirmedWorkplace.id ?: randomUUID(),
                                organization = organization,
                                organizationDepartment = unconfirmedWorkplace.department,
                                address = unconfirmedWorkplace.address,
                                postalCode = unconfirmedWorkplace.postalCode,
                                creationTime = unconfirmedWorkplace.creationTime?.toZonedDateTime() ?: now(),
                                editingTime = now(),
                            )
                        }.toMutableList()
                    )
                }
                publication.authors.clear()
                publicationRepository.saveAndFlush(publication)
                publication.authors.addAll(unconfirmedPublicationAuthors)
            }
            publication.characterCount = characterCount.toLong()
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
    fun incrementViewCount(id: String) {
        val publication = publicationRepository.getReferenceById(id)
        publication.viewsCount += 1
        publication.creator.viewsCount += 1
    }

    @Transactional
    fun submitPublication(
        user: User,
        id: String,
        submitPublicationRequest: SubmitPublicationRequest
    ) {
        val publication = publicationRepository.getReferenceById(id)
        checkPublicationCreator(user, publication)
        if (publication.status == PUBLISHED) {
            throw IllegalArgumentException()
        }
        if (publication.dataCollectionType == STUDENT && submitPublicationRequest.useType == CO_AUTHORSHIP) {
            throw IllegalArgumentException("Co-authorship is not allowed for student data collection ")
        }

        val reviewers = submitPublicationRequest.reviewers.map { reviewer ->
            Reviewer(
                publication = publication,
                email = reviewer.email,
                firstName = reviewer.firstName,
                lastName = reviewer.lastName,
            )
        }

        publication.reviewers.clear()
        publicationRepository.saveAndFlush(publication)
        publication.reviewers.addAll(reviewers)

        publication.status = READY_FOR_PUBLICATION
        publication.accessType = AccessType.valueOf(submitPublicationRequest.accessType.name)
        publication.storageType = StorageType.valueOf(submitPublicationRequest.storageType.name)
        publication.licenseType = LicenseType.valueOf(submitPublicationRequest.licenseType.name)
        publication.useType = UseType.valueOf(submitPublicationRequest.useType.name)
        publication.previewTitle = submitPublicationRequest.previewTitle
        publication.previewSubtitle = submitPublicationRequest.previewSubtitle
        publication.isFairPeerReview = submitPublicationRequest.isPeerReviewEnabled
    }

    fun search(text: String, limit: Int, pageNum: Int): Page<PublicationElastic> {
        val sort = Sort.by("_score").descending()
            .and(Sort.by("publicationTime").descending())
        return elasticRepository.searchByFields(text, PageRequest.of(pageNum, limit, sort))
    }

    @Transactional
    fun getDownloadLinkForArchive(user: User, id: String): DownloadLinkResponse {
        val publication = publicationRepository.findByIdAndIsBlockedIsFalse(id)
        checkStatusPublished(publication)
        val title = publication.title ?: id
        val link: DownloadLinkResponse = when (publication.storageType) {
            CLOUD_SECURE_STORAGE -> {
                val link = fileStorageService.generateTemporaryDownloadLink(
                    ARCHIVED_PUBLICATION_FILES, publication.id, title + "_files.zip"
                )
                DownloadLinkResponse(link, publication.archivePassword, AVAILABLE)
            }

            IPFS -> getIpfsDownloadLink(publication, user)

            else -> throw IllegalArgumentException("Unexpected storage type: ${publication.storageType}")
        }

        addDownloadHistory(user, publication)
        publication.downloadsCount += 1
        user.email?.let {
            notificationService.sendArchivePassword(it, title, publication.authorsNames, publication.archivePassword.require())
        }

        return link
    }

    @Transactional
    fun getIpfsDownloadLink(pub: Publication, user: User): DownloadLinkResponse {
        checkStatusPublished(pub)
        val contentId = pub.contentId.require()
        return (downloadLinkRepository.findByPublicationIdAndExpirationTimeGreaterThan(pub.id, now().plusSeconds(30))
            ?.let { DownloadLinkResponse(it.url, pub.archivePassword, AVAILABLE) }
            ?: run {
                downloadLinkRepository.deleteById(pub.id)
                val contentInfo = ipfsStorageService.getInfo(contentId)
                return when (contentInfo.availability) {
                    INSTANT -> {
                        val downloadLinkInfo = ipfsStorageService.getDownloadLink(contentId)
                        val expirationTime = now().plusSeconds(downloadLinkInfo.expiresIn)  //3600 seconds - default value
                        val newDownloadLink =
                            downloadLinkRepository.save(DownloadLink(pub.id, downloadLinkInfo.url, expirationTime))
                        DownloadLinkResponse(newDownloadLink.url, pub.archivePassword, AVAILABLE)
                    }

                    ARCHIVE -> {
                        restoreRequestRepository.findByPublicationIdAndCompletionTimeIsNull(pub.id)
                            ?: run {
                                ipfsStorageService.restore(contentId)
                                restoreRequestRepository.save(
                                    RestoreRequest(publicationId = pub.id, contentId = contentId, user = user)
                                )
                            }
                        DownloadLinkResponse(null, null, PREPARING)
                    }
                }
            }) as DownloadLinkResponse
    }

    @Transactional
    fun getDownloadLinkForSampleArchive(id: String): DownloadLinkResponse {
        val publication = publicationRepository.findByIdAndIsBlockedIsFalse(id)
        val title = publication.title ?: id
        val link =
            fileStorageService.generateTemporaryDownloadLink(
                ARCHIVED_PUBLICATION_SAMPLE_FILES,
                publication.id,
                title + "_sample_files.zip"
            )
        return DownloadLinkResponse(link, publication.archivePassword, AVAILABLE)
    }

    @Transactional(readOnly = true)
    fun get(user: User?, id: String): Publication {
        val publication = publicationRepository.findByIdAndIsBlockedIsFalse(id)
        checkAccessToPublication(user, publication)
        return publication
    }

    fun getAndCheckPublicationCreator(id: String, user: User): Publication {
        val publication = publicationRepository.findByIdAndIsBlockedIsFalse(id)
        checkPublicationCreator(user, publication)
        return publication
    }

    @Transactional(readOnly = true)
    fun getPublished(id: String): Publication {
        val publication = publicationRepository.findByIdAndIsBlockedIsFalse(id)
        checkStatusPublished(publication)
        return publication
    }

    @Transactional(readOnly = true)
    fun getAllPublications(page: Int, pageSize: Int): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusAndAccessTypeAndIsBlockedIsFalse(
            PUBLISHED,
            OPEN,
            PageRequest.of(page, pageSize, Sort.by(DESC, "publicationTime"))
        )
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService, doiProperties) }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional(readOnly = true)
    fun getAllFeaturedPublications(page: Int, pageSize: Int): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusAndAccessTypeAndIsFeaturedAndIsBlockedIsFalse(
            PUBLISHED,
            OPEN,
            true,
            PageRequest.of(page, pageSize, Sort.by(DESC, "publicationTime"))
        )
        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService, doiProperties) }.toList())
            .isLastPage(publicationsPage.isLast)
    }

    @Transactional
    fun getAuthorsPublications(
        user: User,
        page: Int,
        pageSize: Int,
    ): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByConfirmedAuthorUsernameAndIsBlockedIsFalse(
            setOf(PUBLISHED, READY_FOR_PUBLICATION),
            user.id,
            PageRequest.of(page, pageSize)
        )
        return PublicationsResponse(publicationsPage.isLast)
            .publications(publicationsPage.map { it.toApiObject(userService, doiProperties) }.toList())
    }

    @Transactional
    fun getCreatorPublications(
        user: User,
        statuses: Collection<PublicationStatus>,
        page: Int,
        pageSize: Int,
    ): PublicationsResponse {
        val publicationsPage = publicationRepository.findAllByStatusInAndCreatorIdAndIsBlockedIsFalse(
            statuses,
            user.id,
            PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime"))
        )

        return PublicationsResponse()
            .publications(publicationsPage.map { it.toApiObject(userService, doiProperties) }.toList())
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
        val id = randomAlphanumeric(7).uppercase()
        return if (publicationRepository.existsById(id)) {
            generateCode()
        } else {
            id
        }
    }
}

fun Publication.toApiObject(userService: UserService, doiProperties: DoiProperties) = PublicationApiObject().also { publicationApiModel ->
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
    publicationApiModel.previewTitle = previewTitle
    publicationApiModel.previewSubtitle = previewSubtitle
    publicationApiModel.description = description
    publicationApiModel.doiLink = if (status == PUBLISHED) doiProperties.linkTemplate.format(id) else null
    publicationApiModel.researchAreas = researchAreas?.map { Paragraph(it) }
    publicationApiModel.grantOrganizations = grantOrganizations?.map { Paragraph(it) }
    publicationApiModel.primaryArticles = primaryArticles?.map { Paragraph(it) }
    publicationApiModel.relatedArticles = relatedArticles?.map { Paragraph(it) }
    publicationApiModel.tags = tags?.map { Paragraph(it) }
    publicationApiModel.dataDescription = dataDescription
    publicationApiModel.preliminaryResults = preliminaryResults
    publicationApiModel.software = software
    publicationApiModel.methodTitle = methodTitle
    publicationApiModel.publicationTime = publicationTime?.toOffsetDateTime()
    publicationApiModel.methodDescription = methodDescription
    publicationApiModel.predictedGoals = predictedGoals
    publicationApiModel.authors = authors.map { it.toApiObject(userService.getProfileImage(it.user?.profileImage)) }
    publicationApiModel.viewsCount = viewsCount
    publicationApiModel.downloadsCount = downloadsCount
    publicationApiModel.academicLevel = academicLevel?.let { AcademicLevelApiObject.valueOf(it.name) }
    publicationApiModel.status = PublicationStatusApiObject.valueOf(status.name)
    publicationApiModel.accessType = AccessTypeApiObject.valueOf(accessType.name)
    publicationApiModel.licenseType = licenseType.let { LicenseTypeApiObject.valueOf(it.name) }
    publicationApiModel.creationTime = creationTime.toOffsetDateTime()
    publicationApiModel.editingTime = editingTime.toOffsetDateTime()
    publicationApiModel.negativeData = negativeData
    publicationApiModel.archiveSize = archiveSize
    publicationApiModel.sampleArchiveSize = archiveSampleSize
    publicationApiModel.isNegative = isNegative
    publicationApiModel.isReplicationOfPreviousExperiments = isReplicationOfPreviousExperiments
    publicationApiModel.replicationOfPreviousExperimentsData = replicationOfPreviousExperimentsData
    publicationApiModel.isPreviouslyPublishedDataset = isPreviouslyPublishedDataset
    publicationApiModel.previouslyPublishedDatasetData = previouslyPublishedDatasetData
    publicationApiModel.dataCollectionType = DataCollectionTypeApiObject.valueOf(dataCollectionType.name)
    publicationApiModel.useType = useType?.let { UseTypeApiObject.valueOf(it.name) }
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
        dataDescription = dataDescription,
        preliminaryResults = preliminaryResults,
        software = software,
        methodTitle = methodTitle,
        methodDescription = methodDescription,
        predictedGoals = predictedGoals,
        creationTime = creationTime,
        publicationTime = publicationTime,
        negativeData = negativeData,
    )

fun Author.toApiObject(profileImage: ByteArray?) = AuthorApiObject().also {
    it.id = id
    it.firstName = firstName
    it.lastName = lastName
    it.email = email
    it.ordinal = ordinal
    it.isConfirmed = isConfirmed
    it.user = user?.let { user ->
        UserInfo(
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
    it.workplaces = workplaces.map { workplace -> workplace.toApiObject() }
}
