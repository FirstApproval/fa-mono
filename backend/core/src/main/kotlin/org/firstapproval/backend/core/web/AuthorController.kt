package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthorApi
import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.TopAuthorsResponse
import org.firstapproval.backend.core.domain.user.UserRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthorController(private val userRepository: UserRepository) : AuthorApi {
    override fun getAuthors(searchText: String): ResponseEntity<List<Author>> {
        val textArray = searchText.trim().split("\\s+".toRegex())
        val email = textArray.find { it.contains("@") }?.let { "%$it%" }
        val preparedText = textArray.filter { it.contains("@").not() }
            .joinToString(" & ") { "$it:*" }
            .let { it.ifEmpty { null } }
        val authors = userRepository.findByTextAndEmail(preparedText, email).map {
            Author(it.firstName, it.middleName, it.lastName, it.email, it.selfInfo).id(it.id.toString())
        }
        return ok().body(authors)
    }

    override fun getTopAuthors(page: Int, pageSize: Int): ResponseEntity<TopAuthorsResponse> {
        val authorsPage = userRepository.findAll(PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "creationTime")))
        return ok(
            TopAuthorsResponse()
                .authors(
                    authorsPage.map {
                        Author(it.firstName, it.middleName, it.lastName, it.email, it.selfInfo).id(it.id.toString())
                    }.toList()
                )
                .isLastPage(authorsPage.isLast)
        )
    }
}
