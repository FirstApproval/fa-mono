package org.firstapproval.backend.core.domain.publication

import org.firstapproval.api.server.model.*
import org.firstapproval.backend.core.domain.ipfs.*
import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.api.server.model.UserInfo
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
import org.firstapproval.backend.core.domain.publication.authors.UnconfirmedAuthor
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
import java.util.*
import java.util.UUID.randomUUID
import org.firstapproval.api.server.model.ConfirmedAuthor as ConfirmedAuthorApiObject
import org.firstapproval.api.server.model.UnconfirmedAuthor as UnconfirmedAuthorApiObject
import org.firstapproval.api.server.model.Publication as PublicationApiObject
import org.firstapproval.api.server.model.PublicationStatus as PublicationStatusApiObject
import org.firstapproval.api.server.model.AccessType as AccessTypeApiObject

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val confirmedAuthorRepository: ConfirmedAuthorRepository,
    private val userRepository: UserRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient,
    private val elasticRepository: PublicationElasticRepository
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

    fun getDownloadLink(id: UUID): DownloadLink {
        return downloadLinkRepository.findByPublicationIdAndExpirationTimeLessThan(id, ZonedDateTime.now().minusMinutes(5)) ?: run {
            val pub = getPublicationAndCheckStatus(id, PUBLISHED)
            val downloadLinkInfo = ipfsClient.getDownloadLink(pub.contentId!!)
            val expirationTime = ZonedDateTime.now().plusSeconds(downloadLinkInfo.expiresIn)
            downloadLinkRepository.deleteById(id)
            downloadLinkRepository.save(DownloadLink(pub.id, downloadLinkInfo.url, expirationTime))
        }
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
        val publicationsPage = publicationRepository.findAllByStatusAndAccessType(PUBLISHED, OPEN, PageRequest.of(page, pageSize, Sort.by(DESC, "creationTime")))
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
            .publications(publicationsPage.map { it.toApiObject() }.toList())
            .isLastPage(publicationsPage.isLast)
    }
}

fun Publication.toApiObject() = PublicationApiObject().also { publicationApiModel ->
    publicationApiModel.id = id
    publicationApiModel.creator = UserInfo()
        .id(creator.id)
        .firstName(creator.firstName)
        .lastName(creator.lastName)
        .middleName(creator.middleName)
        .email(creator.email)
        .username(creator.username)
        .selfInfo(creator.selfInfo)
    publicationApiModel.title = title
    publicationApiModel.description = description?.map { Paragraph(it) }
    publicationApiModel.researchArea = researchArea
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
    publicationApiModel.confirmedAuthors = confirmedAuthors.map { it.toApiObject() }
    publicationApiModel.unconfirmedAuthors = unconfirmedAuthors.map { it.toApiObject() }
    publicationApiModel.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    publicationApiModel.accessType = org.firstapproval.api.server.model.AccessType.valueOf(accessType.name)
    publicationApiModel.creationTime = creationTime.toOffsetDateTime()
}

fun PublicationElastic.toApiObject() = PublicationApiObject().also { publicationApiModel ->
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
    publicationApiModel.status = PublicationStatusApiObject.valueOf(status.name)
    publicationApiModel.accessType = AccessTypeApiObject.valueOf(accessType.name)
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

fun ConfirmedAuthor.toApiObject() = ConfirmedAuthorApiObject().also {
    it.id = id
    it.shortBio = shortBio
    it.user = Author(
        user.firstName,
        user.middleName,
        user.lastName,
        user.email,
        user.selfInfo,
    ).id(user.id)
}

fun UnconfirmedAuthor.toApiObject() = UnconfirmedAuthorApiObject().also {
    it.id = id
    it.firstName = firstName
    it.lastName = lastName
    it.middleName = middleName
    it.email = email
    it.shortBio = shortBio
}
