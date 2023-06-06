package org.firstapproval.backend.core.web.errors

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL

@JsonInclude(NON_NULL)
class ErrorBody(
    val error: Enum<*>,
    val errorDescription: String? = null,
    val data: Any? = null
)
