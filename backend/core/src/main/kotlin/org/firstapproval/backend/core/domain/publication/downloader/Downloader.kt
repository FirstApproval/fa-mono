package org.firstapproval.backend.core.domain.publication.downloader

import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Converter
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.hibernate.annotations.Type
import java.sql.Timestamp
import java.time.ZoneId.systemDefault
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME
import java.util.UUID
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
    @Convert(converter = ZonedDateTimeConverter::class)
    @Column(columnDefinition = "text")
    var creationTime: ZonedDateTime = ZonedDateTime.now()
)

@Converter
class ZonedDateTimeConverter : AttributeConverter<ZonedDateTime, String> {

    override fun convertToDatabaseColumn(attribute: ZonedDateTime?): String? {
        return attribute?.format(ISO_OFFSET_DATE_TIME)
    }

    override fun convertToEntityAttribute(dbData: String?): ZonedDateTime? {
        return dbData?.let { ZonedDateTime.parse(it, ISO_OFFSET_DATE_TIME) }
    }
}

