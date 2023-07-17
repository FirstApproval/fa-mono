package org.firstapproval.backend.core.web

import org.firstapproval.api.server.AuthorApi
import org.firstapproval.api.server.model.Author
import org.firstapproval.backend.core.domain.user.UserRepository
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthorController(private val userRepository: UserRepository): AuthorApi {
    override fun getAuthors(searchText: String): ResponseEntity<List<Author>> {
        val preparedText = searchText.trim().split("\\s+".toRegex()).joinToString(" & ")
        val authors = userRepository.findByText("$preparedText:*").map {
            Author(it.firstName, it.middleName, it.lastName, it.email, it.selfInfo)
        }
        return ok().body(authors)
    }
}
