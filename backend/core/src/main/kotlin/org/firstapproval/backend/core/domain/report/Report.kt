package org.firstapproval.backend.core.domain.report

import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import java.time.ZonedDateTime.now
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "reports")
class Report(
    @Id
    var id: UUID = randomUUID(),
    val email: String,
    val description: String,
    @Type(JsonBinaryType::class)
    var fileIds: List<String> = listOf(),
    val creationDate: ZonedDateTime = now()
)
