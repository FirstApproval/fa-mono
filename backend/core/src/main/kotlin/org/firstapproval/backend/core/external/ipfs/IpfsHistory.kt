package org.firstapproval.backend.core.external.ipfs

import jakarta.persistence.Entity
import jakarta.persistence.EnumType.STRING
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes.JSON
import java.time.ZonedDateTime
import java.util.UUID
import java.util.UUID.randomUUID

@Entity
@Table(name = "ipfs_histories")
class IpfsHistory(
    @Id
    var id: UUID = randomUUID(),
    @Enumerated(STRING)
    var queryType: QueryType? = null,
    @JdbcTypeCode(JSON)
    var params: MutableMap<String, Any> = mutableMapOf(),
    var creationTime: ZonedDateTime = ZonedDateTime.now(),
)

enum class QueryType {
    INFO,
    RESTORE,
    UPLOAD,
    DOWNLOAD_LINK,
    DELETE,
}
