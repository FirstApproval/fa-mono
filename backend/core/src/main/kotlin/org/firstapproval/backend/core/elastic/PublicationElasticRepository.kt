package org.firstapproval.backend.core.elastic

import org.firstapproval.backend.core.domain.publication.Publication
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.annotations.Query
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PublicationElasticRepository : ElasticsearchRepository<Publication, UUID> {
    @Query("{\"bool\": {\"should\": [" +
        "{\"match\": {\"title\": \"?0\"}}," +
        "{\"match\": {\"description\": \"?0\"}}," +
        "{\"match\": {\"tags\": \"?0\"}}," +
        "{\"match\": {\"objectOfStudyTitle\": \"?0\"}}," +
        "{\"match\": {\"objectOfStudyDescription\": \"?0\"}}," +
        "{\"match\": {\"software\": \"?0\"}}," +
        "{\"match\": {\"methodDescription\": \"?0\"}}" +
        "]}}")
    fun searchByFields(keyword: String, pageable: Pageable): Page<Publication>
}
