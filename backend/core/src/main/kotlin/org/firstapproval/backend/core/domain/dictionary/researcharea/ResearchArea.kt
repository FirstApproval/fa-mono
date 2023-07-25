package org.firstapproval.backend.core.domain.dictionary.researcharea

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "research_areas")
class ResearchArea(
    @Id
    var id: Long,
    var name: String,
)
