package org.firstapproval.backend.core.domain.publication

import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.Paragraph
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.api.server.model.PublicationsResponse
import org.firstapproval.backend.core.domain.ipfs.DownloadLink
import org.firstapproval.backend.core.domain.ipfs.DownloadLinkRepository
import org.firstapproval.backend.core.domain.ipfs.IpfsClient
import org.firstapproval.backend.core.domain.ipfs.Job
import org.firstapproval.backend.core.domain.ipfs.JobKind
import org.firstapproval.backend.core.domain.ipfs.JobRepository
import org.firstapproval.backend.core.domain.ipfs.JobStatus
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.UnconfirmedUserRepository
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.elastic.PublicationElastic
import org.firstapproval.backend.core.elastic.PublicationElasticRepository
import org.firstapproval.backend.core.exception.RecordConflictException
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
    private val userRepository: UserRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient,
    private val elasticRepository: PublicationElasticRepository
) {
    @Transactional
    fun create(user: User): Publication {
        return publicationRepository.save(Publication(id = randomUUID(), creator = user, confirmedAuthors = listOf(user)))
    }

    @Transactional
    fun edit(id: UUID, request: PublicationEditRequest) {
        val publication = get(id)
        with(request) {
            if (title?.edited == true) publication.title = title.value
            if (description?.edited == true) publication.description = description.value
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
                publication.confirmedAuthors = confirmedAuthors.values.map { userRepository.findById(it).get() }
            }
            if (unconfirmedAuthors?.edited == true) {
                val unconfirmedCoauthorsList = unconfirmedAuthors.values.map {
                    if (userRepository.findByEmail(it.email) != null) throw RecordConflictException("user with this email already exists")
                    unconfirmedUserRepository.saveAndFlush(
                        UnconfirmedUser(
                            id = randomUUID(),
                            email = it.email,
                            firstName = it.firstName,
                            middleName = it.middleName,
                            lastName = it.lastName,
                            shortBio = it.shortBio
                        )
                    )
                }
                publication.unconfirmedAuthors = unconfirmedCoauthorsList
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
        val sort = Sort.by("publicationTime").descending()
            .and(Sort.by("_score").descending())
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
    fun get(id: UUID): Publication {
        return publicationRepository.findById(id).orElseThrow()
    }

    @Transactional
    fun getPublications(
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
    it.description = description
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
    it.authors = confirmedAuthors.map { user -> Author(user.firstName, user.middleName, user.lastName, user.email, user.selfInfo) } +
        unconfirmedAuthors.map { user -> Author(user.firstName, user.middleName, user.lastName, user.email, user.shortBio) }
    it.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    it.accessType = org.firstapproval.api.server.model.AccessType.valueOf(accessType!!.name)
    it.creationTime = creationTime.toOffsetDateTime()
}

fun PublicationElastic.toApiObject() = org.firstapproval.api.server.model.Publication().also { publicationApiModel ->
    publicationApiModel.id = id
    publicationApiModel.title = title
    publicationApiModel.description = description
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
