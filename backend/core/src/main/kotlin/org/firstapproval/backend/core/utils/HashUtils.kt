package org.firstapproval.backend.core.utils

import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.security.MessageDigest

fun calculateSHA256(file: File): String {
    val fis = FileInputStream(file)
    return calculateSHA256(fis)
}

fun calculateSHA256(inputStream: InputStream): String {
    inputStream.use {
        val digest = MessageDigest.getInstance("SHA-256")
        val byteArray = ByteArray(8192)

        var bytesRead: Int
        while (it.read(byteArray).also { bytesRead = it } != -1) {
            digest.update(byteArray, 0, bytesRead)
        }
        val hashBytes = digest.digest()
        val hexString = StringBuilder()
        for (byte in hashBytes) {
            val hex = Integer.toHexString(0xff and byte.toInt())
            if (hex.length == 1) hexString.append('0')
            hexString.append(hex)
        }
        return hexString.toString()
    }
}
