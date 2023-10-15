package org.firstapproval.backend.core.domain.visitor

import org.springframework.data.jpa.repository.JpaRepository

interface VisitorRepository : JpaRepository<Visitor, Long>
