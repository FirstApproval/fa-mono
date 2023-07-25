package org.firstapproval.backend.core.web

import org.firstapproval.api.server.DictionaryApi
import org.firstapproval.api.server.model.IdAndNameHolder
import org.firstapproval.backend.core.domain.dictionary.method.MethodRepository
import org.firstapproval.backend.core.domain.dictionary.objectofstudy.ObjectOfStudyRepository
import org.firstapproval.backend.core.domain.dictionary.researcharea.ResearchAreaRepository
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.RestController

@RestController
class DictionaryController(
    private val methodRepository: MethodRepository,
    private val objectOfStudyRepository: ObjectOfStudyRepository,
    private val researchAreaRepository: ResearchAreaRepository,
) : DictionaryApi {
    override fun getMethods(): ResponseEntity<List<IdAndNameHolder>> {
        val methods =  methodRepository.findAll().map {
            IdAndNameHolder(it.id, it.name)
        }

        return ok().body(methods)
    }

    override fun getObjectsOfStudy(): ResponseEntity<List<IdAndNameHolder>> {
        val objectsOfStudies =  objectOfStudyRepository.findAll().map {
            IdAndNameHolder(it.id, it.name)
        }

        return ok().body(objectsOfStudies)
    }

    override fun getResearchAreas(): ResponseEntity<List<IdAndNameHolder>> {
        val researchAreas =  researchAreaRepository.findAll().map {
            IdAndNameHolder(it.id, it.name)
        }

        return ok().body(researchAreas)
    }
}
