package org.firstapproval.backend.core.domain.publication.downloader

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import java.util.*
import java.util.UUID.randomUUID


@Entity
@Table(name = "downloaders")
class Downloader(
    @Id
    var id: UUID = randomUUID(),
    @OneToOne
    val publication: Publication,
    @OneToOne
    val user: User,
    @Type(JsonBinaryType::class)
    var oldHistory: List<ZonedDateTime>? = emptyList(),
    @Type(JsonBinaryType::class)
    var history: MutableList<DownloadHistory> = mutableListOf(),
    var lastDownloadTime: ZonedDateTime = ZonedDateTime.now()
)

class DownloadHistory(
    var agreeToTheFirstApprovalLicense: Boolean,
    @JsonSerialize(using = ZonedDateTimeSerializer::class)
    var creationTime: ZonedDateTime = ZonedDateTime.now()
)


class ZonedDateTimeSerializer : JsonSerializer<ZonedDateTime>() {
    override fun serialize(value: ZonedDateTime, gen: JsonGenerator, serializers: SerializerProvider?) {
        val parseDate: String = value.toOffsetDateTime().toString() // parse here zoned date time
        gen.writeString(parseDate)
    }
}
