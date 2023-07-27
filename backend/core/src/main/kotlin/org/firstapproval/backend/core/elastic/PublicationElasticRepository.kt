package org.firstapproval.backend.core.elastic

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.annotations.Query
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PublicationElasticRepository : ElasticsearchRepository<PublicationElastic, UUID> {
    @Query("{\"bool\": {\"should\": [" +
        "{\"match\": {\"title\": {\"query\": \"?0\", \"boost\": 3}}}," +
        "{\"match\": {\"description\": {\"query\": \"?0\", \"boost\": 2}}}," +
        "{\"match\": {\"tags\": {\"query\": \"?0\", \"boost\": 1}}}," +
        "{\"match\": {\"objectOfStudyTitle\": {\"query\": \"?0\"}}}," +
        "{\"match\": {\"objectOfStudyDescription\": {\"query\": \"?0\"}}}," +
        "{\"match\": {\"software\": {\"query\": \"?0\"}}}," +
        "{\"match\": {\"methodDescription\": {\"query\": \"?0\", \"boost\": 0.5}}}" +
        "]}}")
    fun searchByFields(keyword: String, pageable: Pageable): Page<PublicationElastic>
}
