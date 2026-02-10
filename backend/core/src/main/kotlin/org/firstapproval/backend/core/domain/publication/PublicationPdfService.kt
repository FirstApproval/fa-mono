package org.firstapproval.backend.core.domain.publication

import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.publication.PublicationStatus.PUBLISHED
import org.firstapproval.backend.core.infra.pdf.PdfService
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import java.lang.String.format
import java.text.DecimalFormat

@Service
class PublicationPdfService(
    private val pdfService: PdfService,
    private val frontendProperties: FrontendProperties,
    private val doiProperties: DoiProperties
) {

    private val formatter = DecimalFormat("#.##")

    fun generate(publication: Publication): ByteArray {
        val templateName = "pdf/publication-pdf"
        return pdfService.generate(templateName, generateThymeleafContext(publication))
    }

    private fun generateThymeleafContext(publication: Publication): Context {
        val context = Context()

        val model = mutableMapOf(
            "doiLink" to format(doiProperties.linkTemplate, publication.id),
            "isPreview" to (publication.status != PUBLISHED),
            "url" to url(publication),
            "title" to getDescriptionOrDraft(publication.title, "Draft. No title yet."),
            "authors" to getDescriptionOrDraft(publication.authorsNames, "Draft. No authors yet."),
            "publishDate" to getDescriptionOrDraft(
                publication.publicationTime?.toLocalDate()?.toString().takeIf { publication.status == PUBLISHED },
                "Dataset is not published yet."
            ),
            "description" to getDescriptionOrDraft(publication.description, "Draft. No description yet."),
            "hash" to hash(publication),
            "files" to files(publication),
            "experimentGoals" to experimentGoals(publication),
            "isNegative" to publication.isNegative,
            "isReplicationOfPreviousExperiments" to publication.isReplicationOfPreviousExperiments,
            "isPreviouslyPublishedDataset" to publication.isPreviouslyPublishedDataset,
            "method" to getDescriptionOrDraft(publication.methodDescription, "Draft. No method description yet."),
            "dataDescription" to getDescriptionOrDraft(publication.dataDescription, "Draft. No data description yet."),
            "authorsDescription" to authorsDescriptions(publication)
        )

        publication.negativeData?.takeIf { publication.isNegative && it.isNotEmpty() }?.let { model["negativeData"] = it }
        publication.replicationOfPreviousExperimentsData?.takeIf { publication.isReplicationOfPreviousExperiments && it.isNotEmpty() }
            ?.let { model["replicationOfPreviousExperimentsData"] = it }
        publication.previouslyPublishedDatasetData?.takeIf { publication.isPreviouslyPublishedDataset && it.isNotEmpty() }
            ?.let { model["previouslyPublishedDatasetData"] = it }

        publication.software?.takeIf { it.isNotBlank() }?.let { model["software"] = it }
        publication.preliminaryResults?.takeIf { it.isNotBlank() }?.let { model["preliminaryResults"] = it }
        model.addIfNotEmpty("grantingOrganizations", publication.grantOrganizations)
        model.addIfNotEmpty("primaryArticles", publication.primaryArticles)
        model.addIfNotEmpty("relatedArticles", publication.relatedArticles)

        context.setVariables(prepareModel(model))
        return context
    }

    private fun MutableMap<String, Any>.addIfNotEmpty(key: String, collection: Collection<Any>?) {
        collection?.takeIf { it.isNotEmpty() }?.let { put(key, it) }
    }

    private fun prepareModel(model: MutableMap<String, Any>) = model.map { (k, v) ->
        if (v is String) {
            k to v
                .replace("<br>", "<br></br>")
                .replace("&nbsp;", " ")
        } else {
            k to v
        }
    }.toMap()

    private fun url(publication: Publication): String {
        return "${frontendProperties.url}/publication/${publication.id}"
    }

    private fun hash(publication: Publication): String = when (publication.status) {
        PUBLISHED -> "Unique archive cryptographic hash: SHA-256: ${publication.hash}"
        else ->
            "Dataset is not published yet, information about dataset unique archive cryptographic hash will be available after publication."
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

    private fun experimentGoals(publication: Publication) =
        getDescriptionOrDraft(publication.predictedGoals, "Draft. No predicted goals yet.")

    private fun getDescriptionOrDraft(description: String?, draftMessage: String) = description?.takeIf { it.isNotEmpty() } ?: draftMessage

    private fun authorsDescriptions(publication: Publication): List<AuthorDescription> {
        return (
            publication.authors
                .map {
                    AuthorDescription(((it.user?.lastName ?: it.lastName) + " " + (it.user?.firstName
                        ?: it.firstName)),
                        it.workplaces.joinToString(", ") { workplace -> "${workplace.organization.name} ${workplace.organizationDepartment ?: ""}" })
                })
    }
}

data class AuthorDescription(
    val fullName: String,
    val workplace: String
)
