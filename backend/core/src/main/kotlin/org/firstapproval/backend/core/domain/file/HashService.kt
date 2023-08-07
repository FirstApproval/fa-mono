package org.firstapproval.backend.core.domain.file

import org.bouncycastle.crypto.digests.Blake2bDigest
import org.bouncycastle.crypto.io.DigestInputStream
import org.bouncycastle.util.encoders.Hex
import org.springframework.stereotype.Service
import java.io.InputStream

@Service
class HashService {

    fun getHash(data: InputStream): String {
        val digest = Blake2bDigest(256)
        val digestInputStream = DigestInputStream(data, digest)
        val buffer = ByteArray(8192)
        var bytesRead: Int
        while (digestInputStream.read(buffer).also { bytesRead = it } != -1) {
            digest.update(buffer, 0, bytesRead)
        }
        val hash = ByteArray(digest.digestSize)
        digest.doFinal(hash, 0)
        val hexString = Hex.toHexString(hash)
        digest.clearKey()
        return hexString
    }
}
