package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.domain.ipfs.*
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.domain.publication.PublicationStatus.READY_FOR_PUBLICATION
import org.firstapproval.backend.core.domain.user.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*
import java.util.UUID.randomUUID

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val downloadLinkRepository: DownloadLinkRepository,
    private val jobRepository: JobRepository,
    private val ipfsClient: IpfsClient
) {
    @Transactional
    fun createDraft(user: User): Publication {
        return publicationRepository.save(Publication(id = randomUUID(), author = user))
    }

    @Transactional
    fun submitPublication(user: User, id: UUID) {
        val publication = publicationRepository.getReferenceById(id)
        checkAccessToPublication(user, publication)
        publication.status = READY_FOR_PUBLICATION
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
}
