package org.firstapproval.backend.core.external.ipfs

import org.firstapproval.backend.core.config.REQUIRE_NEW_TRANSACTION_TEMPLATE
import org.firstapproval.backend.core.external.ipfs.IpfsClient.DownloadFile
import org.firstapproval.backend.core.external.ipfs.IpfsClient.File
import org.firstapproval.backend.core.external.ipfs.QueryType.DELETE
import org.firstapproval.backend.core.external.ipfs.QueryType.DOWNLOAD_LINK
import org.firstapproval.backend.core.external.ipfs.QueryType.INFO
import org.firstapproval.backend.core.external.ipfs.QueryType.RESTORE
import org.firstapproval.backend.core.external.ipfs.QueryType.UPLOAD
import org.firstapproval.backend.core.utils.require
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate

const val MAX_FILE_SIZE = 2_147_483_648
const val IPFS_CONTENT_ID_KEY = "contentId"

@Service
class IpfsStorageService(
    val ipfsClient: IpfsClient,
    val ipfsHistoryRepository: IpfsHistoryRepository,
    @Qualifier(REQUIRE_NEW_TRANSACTION_TEMPLATE) val transactionTemplate: TransactionTemplate
) {

    fun getInfo(id: Long): File {
        saveHistory(INFO, mutableMapOf(IPFS_CONTENT_ID_KEY to id))
        return ipfsClient.getInfo(id)
    }

    fun restore(id: Long) {
        saveHistory(RESTORE, mutableMapOf(IPFS_CONTENT_ID_KEY to id))
        ipfsClient.restore(id)
    }

    fun upload(file: java.io.File): File {
        if (file.length() > MAX_FILE_SIZE) {
            throw IllegalArgumentException("File size '${file.length()}' exceed max file size: '$MAX_FILE_SIZE'")
        }
        val history = saveHistory(UPLOAD, mutableMapOf())

        val fileInfo = ipfsClient.upload(file)

        transactionTemplate.execute {
            history.params[IPFS_CONTENT_ID_KEY] = fileInfo.id
            ipfsHistoryRepository.save(history)
        }
        return fileInfo
    }

    fun getDownloadLink(id: Long): DownloadFile {
        saveHistory(DOWNLOAD_LINK, mutableMapOf(IPFS_CONTENT_ID_KEY to id))
        return ipfsClient.getDownloadLink(id)
    }

    fun delete(id: Long): File {
        saveHistory(DELETE, mutableMapOf(IPFS_CONTENT_ID_KEY to id))
        return ipfsClient.delete(id)
    }

    private fun saveHistory(queryType: QueryType, params: MutableMap<String, Any>): IpfsHistory {
        return transactionTemplate.execute {
            ipfsHistoryRepository.save(IpfsHistory(queryType = queryType, params = params))
        }.require()
    }
}
