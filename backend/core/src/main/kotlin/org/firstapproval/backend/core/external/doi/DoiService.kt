package org.firstapproval.backend.core.external.doi

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.domain.publication.Publication
import org.springframework.stereotype.Service
import java.io.File

@Service
class DoiService(
    private val doiXmlBuilder: DoiXmlBuilder,
    private val doiCrossrefClient: DoiCrossrefClient,
    private val doiProperties: DoiProperties
) {
    private val logger = logger { }
    fun create(publication: Publication) {
        val pubId = publication.id
        val doiId = String.format(doiProperties.idTemplate, pubId)

        logger.info { "Creation of DOI for publication $pubId started" }
        val xml = doiXmlBuilder.build(publication, doiId)
        logger.info { "Creation of DOI for publication $pubId  finished" }

        logger.info { "Publishing of DOI for publication $pubId started" }
        doiCrossrefClient.publish(xml, publication.id)
        logger.info { "Publishing of DOI for publication $pubId finished" }

    }
}
