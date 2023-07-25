package org.firstapproval.backend.core.domain.dictionary.method

import org.springframework.data.jpa.repository.JpaRepository

interface MethodRepository: JpaRepository<Method, Long> {
}
