package org.firstapproval.backend.core.utils

import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.security.MessageDigest
import java.util.Base64


fun calculateSHA256(file: File): String {
    val fis = FileInputStream(file)
    return fis.use { calculateSHA256(it) }
}

fun calculateSHA256(inputStream: InputStream): String {
    val digest = MessageDigest.getInstance("SHA-256")
    val byteArray = ByteArray(8192)

    var bytesRead: Int
    while (inputStream.read(byteArray).also { bytesRead = it } != -1) {
        digest.update(byteArray, 0, bytesRead)
    }
    val hashBytes = digest.digest()
    return sha256HashFromByteArrayHash(hashBytes)
}

fun sha256HashFromBase64(base64: String): String {
    val bytes = Base64.getDecoder().decode(base64)
    return sha256HashFromByteArrayHash(bytes)
}

fun sha256HashFromByteArrayHash(bytes: ByteArray): String {
    val hexString = StringBuilder()
    for (hashByte in bytes) {
        val hex = Integer.toHexString(0xff and hashByte.toInt())
        if (hex.length == 1) {
            hexString.append('0')
        }
        hexString.append(hex)
    }
    return hexString.toString()
}
