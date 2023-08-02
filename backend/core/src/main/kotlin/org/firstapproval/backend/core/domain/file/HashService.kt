package org.firstapproval.backend.core.domain.file

import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.bouncycastle.util.encoders.Hex
import org.springframework.stereotype.Service
import java.io.InputStream
import java.security.MessageDigest
import java.security.Security

@Service
class HashService {
    init {
        Security.addProvider(BouncyCastleProvider())
    }

    fun getHash(data: InputStream): String {
        val algorithm = "BLAKE2B-256"
        val messageDigest: MessageDigest = MessageDigest.getInstance(algorithm, "BC")
        val hashBytes = data.use { input ->
            val buffer = ByteArray(8192)
            var bytesRead: Int
            while (input.read(buffer).also { bytesRead = it } != -1) {
                messageDigest.update(buffer, 0, bytesRead)
            }
            messageDigest.digest()
        }
        return String(Hex.encode(hashBytes))
    }
}
