//package org.firstapproval.backend.core.web
//
//import org.firstapproval.api.server.CollaboratorApi
//import org.firstapproval.api.server.model.GetCollaboratorsResponse
//import org.firstapproval.backend.core.config.security.AuthHolderService
//import org.firstapproval.backend.core.domain.publication.collaborator.toApiObject
//import org.firstapproval.backend.core.domain.user.UserService
//import org.springframework.data.domain.PageRequest
//import org.springframework.http.ResponseEntity
//import org.springframework.http.ResponseEntity.ok
//import org.springframework.web.bind.annotation.RestController
//
//@RestController
//class CollaboratorController(
//    private val collaboratorRepository: CollaboratorRepository,
//    private val userService: UserService,
//    private val authHolderService: AuthHolderService
//) : CollaboratorApi {
//
//    override fun getPublicationCollaborators(publicationId: String, page: Int, pageSize: Int): ResponseEntity<GetCollaboratorsResponse> {
//        val result = collaboratorRepository.findAllByPublicationId(publicationId, PageRequest.of(page, pageSize))
//        val collaborators = result.map { it.toApiObject(userService) }.toList()
//        return ok(
//            GetCollaboratorsResponse(result.isLast)
//                .collaborators(collaborators)
//        )
//    }
////
////    override fun isUserCollaborator(publicationId: String): ResponseEntity<Boolean> {
////        val result = collaboratorRepository.existsByUserIdAndPublicationId(authHolderService.user.id, publicationId)
////        return ok(result)
////    }
//}
