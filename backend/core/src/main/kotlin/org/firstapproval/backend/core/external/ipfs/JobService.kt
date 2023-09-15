package org.firstapproval.backend.core.external.ipfs

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.external.ipfs.IpfsClient.IpfsJobKind.RESTORE
import org.firstapproval.backend.core.external.ipfs.IpfsClient.IpfsJobStatus.COMPLETE
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime.now

@Service
class JobService(val ipfsClient: IpfsClient, val jobRepository: JobRepository) {
    @Scheduled(cron = "\${check-jobs.cron}")
    @SchedulerLock(name = "ArchiveService.archivePublicationFiles")
    fun checkJobs() {
        val jobs = jobRepository.findAllByStatusNot(status = JobStatus.COMPLETE)
        val jobsIds = jobs.map { it.id }
        val completedJobs = ipfsClient.getJobs().filter { jobsIds.contains(it.id) && it.status == COMPLETE && it.kind == RESTORE }
        val completedIpfsJobsIds = completedJobs.map { it.id }

        completedJobs.forEach {
            //TODO notify users about completion jobs
        }

        jobRepository.updateStatusAndCompletionTime(now(), completedIpfsJobsIds)
    }
}
