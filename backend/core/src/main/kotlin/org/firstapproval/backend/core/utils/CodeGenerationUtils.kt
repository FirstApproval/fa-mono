package org.firstapproval.backend.core.utils

import kotlin.random.Random

const val EMAIL_CONFIRMATION_CODE_LENGTH = 6

fun generateCode(length: Int): String {
    val random = Random(System.currentTimeMillis())
    val stringBuilder = StringBuilder()

    repeat(length) {
        val digit = random.nextInt(10)
        stringBuilder.append(digit)
    }

    return stringBuilder.toString()
}
