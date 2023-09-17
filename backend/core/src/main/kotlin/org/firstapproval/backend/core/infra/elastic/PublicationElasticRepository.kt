package org.firstapproval.backend.core.infra.elastic

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.annotations.Query
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import org.springframework.stereotype.Repository
import java.util.UUID

private const val PUBLICATIONS_SEARCH_QUERY = """
    {
      "multi_match": {
        "query": "?0",
        "fields": [
          "title",
          "description",
          "grantOrganizations",
          "primaryArticles",
          "relatedArticles",
          "tags",
          "objectOfStudyTitle",
          "objectOfStudyDescription",
          "software",
          "methodTitle",
          "methodDescription",
          "predictedGoals",
          "negativeData"
        ]
      }
    }
"""

@Repository
interface PublicationElasticRepository : ElasticsearchRepository<PublicationElastic, UUID> {
    @Query(PUBLICATIONS_SEARCH_QUERY)
    fun searchByFields(keyword: String, pageable: Pageable): Page<PublicationElastic>
}
