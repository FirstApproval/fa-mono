package org.firstapproval.backend.core.infra.elastic

import jakarta.persistence.Id
import jakarta.persistence.Transient
import org.firstapproval.backend.core.domain.publication.AccessType
import org.firstapproval.backend.core.domain.publication.PublicationStatus
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PENDING
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType
import org.springframework.data.elasticsearch.annotations.FieldType.Date_Nanos
import org.springframework.data.elasticsearch.annotations.FieldType.Keyword
import org.springframework.data.elasticsearch.annotations.FieldType.Text
import java.time.ZonedDateTime
import java.util.UUID

@Document(indexName = "publications")
class PublicationElastic(
    @Id
    var id: UUID,
    @Transient
    val creatorId: UUID,
    @Field(type = Keyword)
    var status: PublicationStatus = PENDING,
    var accessType: AccessType,
    @Field(type = Text)
    var title: String? = null,
    var description: List<String>? = null,
    @Field(type = Keyword)
    var grantOrganizations: List<String>? = null,
    var primaryArticles: List<String>? = null,
    var relatedArticles: List<String>? = null,
    @Field(type = Keyword)
    var tags: List<String>? = null,
    @Field(type = Text)
    var objectOfStudyTitle: String? = null,
    @Field(type = Keyword)
    var objectOfStudyDescription: List<String>? = null,
    @Field(type = Text)
    var software: List<String>? = null,
    @Field(type = Text)
    var methodTitle: String? = null,
    @Field(type = Text)
    var methodDescription: List<String>? = null,
    var predictedGoals: List<String>? = null,
    @Field(type = Date_Nanos)
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
    @Field(type = Date_Nanos)
    var publicationTime: ZonedDateTime? = null,
    @Field(type = Text)
    var negativeData: String? = null,
    @Field(type = FieldType.Long)
    var archiveSize: Long? = null,
    @Field(type = FieldType.Long)
    var archiveSampleSize: Long? = null,
    @Field(type = FieldType.Boolean)
    var isNegative: Boolean? = null,
)
