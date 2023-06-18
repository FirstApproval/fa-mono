package org.firstapproval.backend.core.utils

import kotlin.random.Random

fun generateCode(length: Int): String {
    val random = Random(System.currentTimeMillis())
    val stringBuilder = StringBuilder()

    repeat(length) {
        val digit = random.nextInt(10)
        stringBuilder.append(digit)
    }

    return stringBuilder.toString()
}