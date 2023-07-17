package org.firstapproval.backend.core.domain.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(email: String?): User?
    fun findByEmail(email: String): User?

    @Query(
        nativeQuery = true,
        value = "select * from users u left join external_ids o on u.id = o.user_id " +
                "where (:email is not null and email = :email) or (o.external_id = :externalId and o.type = :#{#type.name})"
    )
    fun findByEmailOrExternalIdAndType(email: String? = null, externalId: String, type: OauthType): User?
    fun existsByEmail(email: String): Boolean
    fun findByEmailAndPasswordIsNull(email: String): User?

    @Query(value = "select * from users where tsv @@ to_tsquery('simple', :text)", nativeQuery = true)
    fun findByText(text: String): List<User>
}
