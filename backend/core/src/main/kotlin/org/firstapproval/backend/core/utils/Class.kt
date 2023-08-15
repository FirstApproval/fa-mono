package org.firstapproval.backend.core.utils

import java.lang.reflect.Field

fun Class<*>.allFields(): List<Field> = (this.superclass?.allFields() ?: emptyList()) + this.declaredFields

fun Field.getValue(obj: Any): Any? = if (this.canAccess(obj) || this.trySetAccessible()) {
    this.get(obj)
} else {
    throw IllegalAccessException()
}
