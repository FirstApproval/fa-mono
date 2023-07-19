package org.firstapproval.backend.core.domain.publication

import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.PublicationEditRequest
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
import org.firstapproval.backend.core.exception.RecordConflictException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val unconfirmedUserRepository: UnconfirmedUserRepository,
    private val userRepository: UserRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient
) {
    @Transactional
    fun create(user: User): Publication {
        return publicationRepository.save(Publication(id = randomUUID(), creator = user, confirmedAuthors = listOf(user)))
    }

    @Transactional
    fun edit(id: UUID, request: PublicationEditRequest) {
        val publication = get(id)
        with(request) {
            if (title.edited) publication.title = title.value
            if (description.edited) publication.description = description.value
            if (grantOrganizations.edited) publication.grantOrganizations = grantOrganizations.values
            if (relatedArticles.edited) publication.relatedArticles = relatedArticles.values
            if (tags.edited) publication.tags = tags.values
            if (objectOfStudyTitle.edited) publication.objectOfStudyTitle = objectOfStudyTitle.value
            if (objectOfStudyDescription.edited) publication.objectOfStudyDescription = objectOfStudyDescription.value
            if (software.edited) publication.software = software.value
            if (methodTitle.edited) publication.methodTitle = methodTitle.value
            if (methodDescription.edited) publication.methodDescription = methodDescription.value
            if (predictedGoals.edited) publication.predictedGoals = predictedGoals.value
            if (confirmedAuthors.edited) {
                publication.confirmedAuthors = confirmedAuthors.values.map { userRepository.findById(it).get() }
            }
            if (unconfirmedAuthors.edited) {
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
}

fun Publication.toApiObject() = org.firstapproval.api.server.model.Publication().also {
    it.id = id
    it.title = title
    it.description = description
    it.grantOrganizations = grantOrganizations
    it.relatedArticles = relatedArticles
    it.tags = tags
    it.objectOfStudyTitle = objectOfStudyTitle
    it.objectOfStudyDescription = objectOfStudyDescription
    it.software = software
    it.methodTitle = methodTitle
    it.methodDescription = methodDescription
    it.predictedGoals = predictedGoals
    it.authors = confirmedAuthors.map { user -> Author(user.firstName, user.middleName, user.lastName, user.email, user.selfInfo) } +
        unconfirmedAuthors.map { user -> Author(user.firstName, user.middleName, user.lastName, user.email, user.shortBio) }
    it.status = org.firstapproval.api.server.model.PublicationStatus.valueOf(status.name)
    it.accessType = org.firstapproval.api.server.model.AccessType.valueOf(it.accessType.name)
    it.creationTime = creationTime.toOffsetDateTime()
}
