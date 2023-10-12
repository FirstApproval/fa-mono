package org.firstapproval.backend.core.utils

import java.util.Optional
import kotlin.reflect.KClass

inline fun <reified T> T?.require(): T = this ?: throw NotFoundException(T::class)

inline fun <reified T> Optional<T>.require(): T = orElseThrow { NotFoundException(T::class) }

class NotFoundException(entityClass: KClass<*>) : RuntimeException("${entityClass.java.simpleName} not found")

inline fun <T, R> Iterable<T>.allUniqueBy(transform: (T) -> R): Boolean {
    val hashset = hashSetOf<R>()
    return this.all { hashset.add(transform(it)) }
}
