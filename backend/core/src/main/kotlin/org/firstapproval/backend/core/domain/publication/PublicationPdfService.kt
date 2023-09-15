package org.firstapproval.backend.core.domain.publication

import org.apache.commons.codec.digest.DigestUtils.sha256Hex
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.infra.pdf.PdfService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.thymeleaf.context.Context
import java.util.UUID
import java.util.UUID.randomUUID

@Service
class PublicationPdfService(
    private val publicationRepository: PublicationRepository,
    private val pdfService: PdfService,
    private val frontendProperties: FrontendProperties
) {

    @Transactional(readOnly = true)
    fun generate(publicationId: UUID): ByteArray {
        val publication = publicationRepository.getReferenceById(publicationId)
        val templateName = "pdf/publication-pdf"
        return pdfService.generate(templateName, generateThymeleafContext(publication))
    }

    private fun generateThymeleafContext(publication: Publication): Context {
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["isPreview"] = publication.status != PUBLISHED
        model["isNegative"] = publication.isNegative
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
        if (publication.primaryArticles != null && publication.primaryArticles!!.isNotEmpty()) {
            model["primaryArticles"] = primaryArticles(publication)
        }
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
            "Unique archive cryptographic hash: SHA-256: ${sha256Hex(randomUUID().toString())}"
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
        return toParagraphs(publication.primaryArticles!!)
    }

    private fun relatedArticles(publication: Publication): String {
        return publication.relatedArticles!!.joinToString(
            separator = "",
            prefix = "<ol style=\"padding-left: 14px; margin-bottom: 4px\">",
            postfix = "</ol>"
        ) { "<li style=\"font: normal 400 10px \'Roboto\', sans-serif;\">$it</li>" }
    }

    private fun toParagraphs(strings: List<String>): String {
        return strings.joinToString(separator = "<br/>")
    }
}
