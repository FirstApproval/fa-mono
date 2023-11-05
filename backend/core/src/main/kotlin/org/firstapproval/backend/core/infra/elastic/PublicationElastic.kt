package org.firstapproval.backend.core.infra.elastic

import jakarta.persistence.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType.Date_Nanos
import org.springframework.data.elasticsearch.annotations.FieldType.Text
import org.springframework.data.elasticsearch.annotations.Setting
import java.time.ZonedDateTime
import java.util.UUID

@Document(indexName = "publications")
@Setting(settingPath = "elastic.json")
class PublicationElastic(
    @Id
    var id: String,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var title: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var description: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var grantOrganizations: List<String>? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var primaryArticles: List<String>? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var relatedArticles: List<String>? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var tags: List<String>? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var dataDescription: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var software: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var methodTitle: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var methodDescription: String? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var predictedGoals: String? = null,
    @Field(type = Date_Nanos)
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
    @Field(type = Date_Nanos)
    var publicationTime: ZonedDateTime? = null,
    @Field(type = Text, analyzer = "edge_ngram_analyzer")
    var negativeData: String? = null,
)
