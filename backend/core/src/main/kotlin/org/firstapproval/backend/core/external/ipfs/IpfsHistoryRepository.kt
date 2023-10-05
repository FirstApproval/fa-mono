package org.firstapproval.backend.core.external.ipfs

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IpfsHistoryRepository : JpaRepository<IpfsHistory, UUID>
