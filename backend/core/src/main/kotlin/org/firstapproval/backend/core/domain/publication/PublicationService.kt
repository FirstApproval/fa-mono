package org.firstapproval.backend.core.domain.publication

import org.firstapproval.api.server.model.Author
import org.firstapproval.api.server.model.PublicationEditRequest
import org.firstapproval.backend.core.domain.user.UnconfirmedUser
import org.firstapproval.backend.core.domain.user.UnconfirmedUserRepository
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.domain.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
import java.util.UUID.*

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
    private val unconfirmedUserRepository: UnconfirmedUserRepository,
    private val userRepository: UserRepository
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
                    unconfirmedUserRepository.saveAndFlush(
                        UnconfirmedUser(
                            id = randomUUID(),
                            email = it.email,
                            fullName = it.fullName,
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
    fun get(id: UUID): Publication {
        return publicationRepository.findById(id).orElseThrow()
    }
}

fun Publication.toApiObject() = org.firstapproval.api.server.model.Publication().also {
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
    it.authors = confirmedAuthors.map { user -> Author(user.fullName, user.email, null) } +
        unconfirmedAuthors.map { user -> Author(user.fullName, user.email, user.shortBio) }
}
