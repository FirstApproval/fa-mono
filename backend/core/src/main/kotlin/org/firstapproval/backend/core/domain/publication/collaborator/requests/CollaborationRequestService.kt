package org.firstapproval.backend.core.domain.publication.collaborator.requests

import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.publication.PublicationRepository
import org.firstapproval.backend.core.domain.publication.PublicationService
import org.firstapproval.backend.core.domain.publication.collaborator.Collaborator
import org.firstapproval.backend.core.domain.publication.collaborator.CollaboratorRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*

@Service
class CollaborationRequestService(
    private val collaborationRequestRepository: CollaborationRequestRepository,
    private val collaboratorRepository: CollaboratorRepository,
    private val publicationRepository: PublicationRepository,
    private val publicationService: PublicationService,
    private val authHolderService: AuthHolderService
) {
    @Transactional
    fun approve(collaborationRequestId: UUID) {
        val collaborationRequest: CollaborationRequest = collaborationRequestRepository.getReferenceById(collaborationRequestId)
        if (collaborationRequest.publication.creator.id != authHolderService.user.id) {
            throw IllegalAccessException("Approve collaboration can only publication creator")
        }

        collaboratorRepository.save(
            Collaborator(
                publication = collaborationRequest.publication,
                user = collaborationRequest.user
            )
        )
        collaborationRequest.approvalTime = ZonedDateTime.now()
        publicationService.incrementCollaboratorsCount(collaborationRequest.publication.id)
    }

    @Transactional
    fun reject(collaborationRequestId: UUID) {
        val collaborationRequest: CollaborationRequest = collaborationRequestRepository.getReferenceById(collaborationRequestId)
        if (collaborationRequest.publication.creator.id != authHolderService.user.id) {
            throw IllegalAccessException("Reject collaboration can only publication creator")
        }
        collaborationRequest.rejectionTime = ZonedDateTime.now()
    }

    @Transactional
    fun createCollaborationRequest(publicationId: String) {
        val publication = publicationRepository.getReferenceById(publicationId)
        collaborationRequestRepository.save(
            CollaborationRequest(
                publication = publication,
                user = authHolderService.user,
            )
        )
    }

    @Transactional
    fun get(id: UUID): CollaborationRequest {
        return collaborationRequestRepository.getReferenceById(id)
    }
}
