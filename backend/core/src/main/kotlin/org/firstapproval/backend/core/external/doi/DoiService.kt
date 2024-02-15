package org.firstapproval.backend.core.external.doi

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.domain.publication.Publication
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Service
class DoiService(
    private val doiXmlBuilder: DoiXmlBuilder,
    private val doiCrossrefClient: DoiCrossrefClient,
    private val doiProperties: DoiProperties
) {
    private val logger = logger { }

    @Transactional
    fun create(publication: Publication, publicationTime: ZonedDateTime) {
        val pubId = publication.id
        val doiId = String.format(doiProperties.idTemplate, pubId)

        logger.info { "Creation of DOI for publication $pubId started" }
        val xml = doiXmlBuilder.build(publication, doiId, publicationTime)
        logger.info { "Creation of DOI for publication $pubId  finished" }

        logger.info { "Publishing of DOI for publication $pubId started" }
        doiCrossrefClient.publish(xml, publication.id)
        logger.info { "Publishing of DOI for publication $pubId finished" }

    }
}
