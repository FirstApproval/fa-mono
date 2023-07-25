package org.firstapproval.backend.core.domain.dictionary.objectofstudy

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "objects_of_studies")
class ObjectOfStudy(
    @Id
    var id: Long,
    var name: String,
)

