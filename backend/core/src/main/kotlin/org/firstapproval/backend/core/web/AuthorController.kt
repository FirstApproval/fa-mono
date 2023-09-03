package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthorApi
import org.firstapproval.api.server.model.TopAuthorsResponse
import org.firstapproval.api.server.model.UserInfo
import org.firstapproval.backend.core.config.security.AuthHolderService
import org.firstapproval.backend.core.config.security.user
import org.firstapproval.backend.core.domain.user.UserRepository
import org.firstapproval.backend.core.domain.user.UserService
import org.firstapproval.backend.core.domain.user.toApiObject
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction.DESC
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthorController(
    private val userRepository: UserRepository,
    private val userService: UserService,
    private val authHolderService: AuthHolderService
) : AuthorApi {
    override fun getAuthors(searchText: String): ResponseEntity<List<UserInfo>> {
        val textArray = searchText.trim().split("\\s+".toRegex())
        val email = textArray.find { it.contains("@") }?.let { "%$it%" }
        val preparedText = textArray.filter { it.contains("@").not() }
            .joinToString(" & ") { "$it:*" }
            .let { it.ifEmpty { null } }
        val authors =
            userRepository.findByTextAndEmailAndNotId(preparedText, email, authHolderService.user.id).map { it.toApiObject(userService) }
        return ok().body(authors)
    }

    override fun getTopAuthors(page: Int, pageSize: Int): ResponseEntity<TopAuthorsResponse> {
        val authorsPage = userRepository.findAll(PageRequest.of(page, pageSize, Sort.by(DESC, "viewsCount")))
        return ok(
            TopAuthorsResponse()
                .authors(authorsPage.map { it.toApiObject(userService) }.toList())
                .isLastPage(authorsPage.isLast)
        )
    }
}
