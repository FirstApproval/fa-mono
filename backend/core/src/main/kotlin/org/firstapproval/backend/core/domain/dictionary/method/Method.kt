package org.firstapproval.backend.core.domain.dictionary.method

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "methods")
class Method(
    @Id
    var id: Long,
    var name: String,
)
