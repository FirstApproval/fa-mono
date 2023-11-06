package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.infra.pdf.PdfService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.thymeleaf.context.Context
import java.text.DecimalFormat


@Service
class PublicationPdfService(
    private val pdfService: PdfService,
    private val frontendProperties: FrontendProperties
) {

    private val formatter = DecimalFormat("#.##")

    @Transactional(readOnly = true)
    fun generate(publication: Publication): ByteArray {
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
        if (publication.isNegative && !publication.negativeData.isNullOrEmpty()) {
            model["negativeData"] = negativeData(publication)
        }
        model["method"] = method(publication)
        model["dataDescription"] = dataDescription(publication)
        if (!publication.software.isNullOrEmpty()) {
            model["software"] = software(publication)
        }
        model["authorsDescription"] = authorsDescriptions(publication)
        if (!publication.grantOrganizations.isNullOrEmpty()) {
            model["grantingOrganizations"] = grantingOrganizations(publication)
        }
        if (!publication.primaryArticles.isNullOrEmpty()) {
            model["primaryArticles"] = primaryArticles(publication)
        }
        if (!publication.relatedArticles.isNullOrEmpty()) {
            model["relatedArticles"] = relatedArticles(publication)
        }
        context.setVariables(prepareModel(model))
        return context
    }

    private fun prepareModel(model: MutableMap<String, Any>) = model.map { (k, v) ->
        if (v is String) {
            k to v
                .replace("<br>", "<br></br>")
        } else {
            k to v
        }
    }.toMap()

    private fun url(publication: Publication): String {
        return "${frontendProperties.url}/publication/${publication.id}"
    }

    private fun title(publication: Publication): String {
        return if (publication.title.isNullOrEmpty()) {
            "Draft. No title yet."
        } else {
            publication.title!!
        }
    }

    private fun authorNames(publication: Publication): String {
        if (publication.authors.isEmpty()) {
            return "Draft. No authors yet."
        }
        return publication.authorsNames
    }

    private fun publishDate(publication: Publication): String {
        return if (publication.status != PUBLISHED) {
            "Dataset is not published yet."
        } else {
            publication.publicationTime!!.toLocalDate().toString()
        }
    }

    private fun description(publication: Publication): String {
        return if (publication.description.isNullOrEmpty()) {
            return "Draft. No description yet."
        } else {
            publication.description!!
        }
    }

    private fun hash(publication: Publication): String {
        return if (publication.status == PUBLISHED) {
            "Unique archive cryptographic hash: SHA-256: ${publication.hash}"
        } else {
            "Dataset is not published yet, information about dataset unique archive cryptographic hash will be available after publication."
        }
    }

    private fun files(publication: Publication): String {
        return if (publication.status == PUBLISHED) {
            val kilobytes = publication.archiveSize!!.toDouble() / 1024
            val size = if (kilobytes > 1024) {
                val megabytes = kilobytes / 1024
                if (megabytes > 1024) {
                    "${formatter.format(megabytes / 1024)} GB"
                } else {
                    "${formatter.format(megabytes)} MB"
                }
            } else {
                "${formatter.format(kilobytes)} KB"
            }
            "${publication.foldersCount} folders & ${publication.filesCount} files – $size"
        } else {
            "Dataset is not published yet, information about dataset files will be available after publication."
        }
    }

    private fun experimentGoals(publication: Publication): String {
        return if (publication.predictedGoals.isNullOrEmpty()) {
            "Draft. No predicted goals yet."
        } else {
            publication.predictedGoals!!
        }
    }

    private fun negativeData(publication: Publication): String {
        return publication.negativeData!!
    }

    private fun method(publication: Publication): String {
        return if (publication.methodDescription.isNullOrEmpty()) {
            "Draft. No method description yet."
        } else {
            publication.methodDescription!!
        }
    }

    private fun dataDescription(publication: Publication): String {
        return if (publication.dataDescription.isNullOrEmpty()) {
            "Draft. No data description yet."
        } else {
            publication.dataDescription!!
        }
    }

    private fun software(publication: Publication): String {
        return publication.software!!
    }

    private fun authorsDescriptions(publication: Publication): List<AuthorDescription> {
        return (
            publication.authors
                .map {
                    AuthorDescription(((it.user?.lastName ?: it.lastName) + " " + (it.user?.firstName
                        ?: it.firstName)),
                        (it.workplaces.joinToString(", ") { workplace -> "${workplace.organization.name} ${workplace.organizationDepartment ?: ""}" }
                            ?: ""))
                })
    }

    private fun grantingOrganizations(publication: Publication): List<String> {
        return publication.grantOrganizations!!
    }

    private fun primaryArticles(publication: Publication): List<String> {
        return publication.primaryArticles!!
    }

    private fun relatedArticles(publication: Publication): List<String> {
        return publication.relatedArticles!!
    }
}

data class AuthorDescription(
    val fullName: String,
    val workplace: String
)
