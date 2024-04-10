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
    @Column(columnDefinition = "timestamp with time zone")
    var creationTime: ZonedDateTime
)

@Converter(autoApply = true)
class ZonedDateTimeConverter : AttributeConverter<ZonedDateTime, Timestamp> {

    override fun convertToDatabaseColumn(attribute: ZonedDateTime?): Timestamp? {
        return attribute?.let { Timestamp.from(it.toInstant()) }
    }

    override fun convertToEntityAttribute(dbData: Timestamp?): ZonedDateTime? {
        return dbData?.toInstant()?.atZone(systemDefault())
    }
}
