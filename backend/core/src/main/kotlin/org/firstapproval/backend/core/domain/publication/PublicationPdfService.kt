package org.firstapproval.backend.core.domain.publication

import org.apache.commons.codec.digest.DigestUtils.sha256Hex
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.infra.pdf.PdfService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.thymeleaf.context.Context
import java.util.UUID

@Service
class PublicationPdfService(
    private val publicationRepository: PublicationRepository,
    private val pdfService: PdfService,
    private val frontendProperties: FrontendProperties
) {

    @Transactional(readOnly = true)
    fun generate(publicationId: UUID): ByteArray {
        val publication = publicationRepository.getReferenceById(publicationId)
        val templateName = "pdf/publication-pdf-negative"
        return pdfService.generate(templateName, generateThymeleafContext(publication))
    }

    private fun generateThymeleafContext(publication: Publication): Context {
        // publication hash

        // формат списка грантинг организаций
        // формат списка примари статей
        // формат списка релейтед статей

        // template for positive data
        // template for preview mode

        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["url"] = url(publication)
        model["title"] = title(publication)
        model["authors"] = authorNames(publication)
        model["publishDate"] = publishDate(publication)
        model["description"] = description(publication)
        model["hash"] = hash(publication)
        model["files"] = files(publication)
        model["experimentGoals"] = experimentGoals(publication)
        model["negativeData"] = negativeData(publication)
        model["methodName"] = methodName(publication)
        model["method"] = method(publication)
        model["objectOfStudyName"] = objectOfStudyName(publication)
        model["objectOfStudy"] = objectOfStudy(publication)
        model["software"] = software(publication)
        model["authorsDescription"] = authorsDescriptions(publication)
        model["grantingOrganizations"] = grantingOrganizations(publication)
        model["primaryArticles"] = primaryArticles(publication)
        model["relatedArticles"] = relatedArticles(publication)
        context.setVariables(model)
        return context
    }

    private fun url(publication: Publication): String {
        return "${frontendProperties.url}/publication/${publication.id}"
    }

    private fun title(publication: Publication): String {
        return publication.title!!
    }

    private fun authorNames(publication: Publication): String {
        val confirmedAuthorNames = publication.confirmedAuthors
            .map { it.user.lastName + " " + it.user.firstName }
        val unconfirmedAuthorNames = publication.unconfirmedAuthors
            .map { it.lastName + " " + it.firstName }
        return (confirmedAuthorNames + unconfirmedAuthorNames).joinToString(postfix = ".")
    }

    private fun publishDate(publication: Publication): String {
        return publication.publicationTime!!.toLocalDate().toString()
    }

    private fun description(publication: Publication): String {
        return toParagraphs(publication.description!!)
    }

    private fun hash(publication: Publication): String {
        return if (publication.status == PUBLISHED) {
            "Unique archive cryptographic hash: SHA-256: ${sha256Hex("change-me-with-publication-archive-hash-and-drop-sha-256-hex")}"
        } else {
            "Dataset is not published yet, information about dataset unique archive cryptographic hash will be available after publication."
        }
    }

    private fun files(publication: Publication): String {
        return if (publication.status == PUBLISHED) {
            "${publication.foldersCount} folders & ${publication.filesCount} files – ${publication.archiveSize!! / 1024 / 1024 / 1024} GB"
        } else {
            "Dataset is not published yet, information about dataset files will be available after publication."
        }
    }

    private fun experimentGoals(publication: Publication): String {
        return toParagraphs(publication.predictedGoals!!)
    }

    private fun negativeData(publication: Publication): String {
        return publication.negativeData!!
    }

    private fun methodName(publication: Publication): String {
        return publication.methodTitle!!
    }

    private fun method(publication: Publication): String {
        return toParagraphs(publication.methodDescription!!)
    }

    private fun objectOfStudyName(publication: Publication): String {
        return publication.objectOfStudyTitle!!
    }

    private fun objectOfStudy(publication: Publication): String {
        return toParagraphs(publication.objectOfStudyDescription!!)
    }

    private fun software(publication: Publication): String {
        return toParagraphs(publication.software!!)
    }

    private fun authorsDescriptions(publication: Publication): String {
        return (publication.confirmedAuthors.associate { it.user.lastName + " " + it.user.firstName to (it.shortBio ?: "") } +
            publication.unconfirmedAuthors.associate { it.lastName + " " + it.firstName to (it.shortBio ?: "") })
            .map { "<div style=\"margin-bottom: 2px\"><b>${it.key}.</b> ${it.value}</div>" }.joinToString(separator = "")
    }

    private fun grantingOrganizations(publication: Publication): String {
        return publication.grantOrganizations!!.joinToString(
            separator = "",
            prefix = "<ul style=\"padding-left: 10px; margin-bottom: 4px\">",
            postfix = "</ul>"
        ) { "<li style=\"font: normal 400 10px \'Roboto\', sans-serif;\">$it</li>" }
    }

    private fun primaryArticles(publication: Publication): String {
        return "T. Glinin, M. Petrova, E. Daev, Introgression, admixture, and selection facilitate genetic adaptation to high-altitude environments in cattle, Genomics, Volume 113, Issue 3, 2021, Pages 1491-1503, ISSN 0888-7543, https://doi.org/10.1016/j.ygeno.2021.03.0 23."
    }

    private fun relatedArticles(publication: Publication): String {
        return listOf(
            "A. B. Tóthet al., Reorganization of surviving mammalcommunities after the end-Pleistocene megafaunal extinction.Science365, 1305–1308 (2019). doi:10.1126/science.aaw1605; pmid:316042402.",
            "J. L. Gill, J. W. Williams, S. T. Jackson, K. B. Lininger,G. S. Robinson, Pleistocene megafaunal collapse, novel plantcommunities, and enhanced fire regimes in North America.Science326, 1100–1103 (2009). doi:10.1126/science.1179504;pmid:199654263.",
            "F.A.Smith,R.E.ElliottSmith,S.K.Lyons,J.L.Payne,Bodysizedowngrading of mammals over the late Quaternary.Science360,310–313 (2018). doi:10.1126/science.aao5987;pmid:296745914.",
            "A. D. Barnoskyet al., Has the Earth’s sixth mass extinctionalready arrived?Nature471,51–57 (2011). doi:101038/nature09678; pmid:213688235.",
            "P. L. Koch, A. D. Barnosky, Late Quaternary extinctions: Stateof the debate.Annu. Rev. Ecol. Evol. Syst.37, 215–25.",
            "A. D. Barnosky, E. L. Lindsey, Timing of Quaternary megafaunalextinction in South America in relation to human arrivaland climate change.Quat. Int.217,10–29 (2010). doi:10.1016/j.quaint.2009.11.0177.",
        ).joinToString(
            separator = "",
            prefix = "<ol style=\"padding-left: 14px; margin-bottom: 4px\">",
            postfix = "</ol>"
        ) { "<li style=\"font: normal 400 10px \'Roboto\', sans-serif;\">$it</li>" }
    }

    private fun toParagraphs(strings: List<String>): String {
        return strings.joinToString(separator = "<br/>")
    }
}
