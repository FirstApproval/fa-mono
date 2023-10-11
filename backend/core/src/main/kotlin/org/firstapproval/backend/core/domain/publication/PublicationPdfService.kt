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
    private val publicationRepository: PublicationRepository,
    private val pdfService: PdfService,
    private val frontendProperties: FrontendProperties
) {

    private val formatter = DecimalFormat("#.##")

    @Transactional(readOnly = true)
    fun generate(publicationId: String): ByteArray {
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
        if (publication.isNegative && !publication.negativeData.isNullOrEmpty()) {
            model["negativeData"] = negativeData(publication)
        }
        model["method"] = method(publication)
        model["objectOfStudyName"] = objectOfStudyName(publication)
        model["objectOfStudy"] = objectOfStudy(publication)
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
        context.setVariables(model)
        return context
    }

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
        if (publication.confirmedAuthors.isEmpty() && publication.unconfirmedAuthors.isEmpty()) {
            return "Draft. No authors yet."
        }
        val confirmedAuthorNames = publication.confirmedAuthors
            .map { it.user.lastName + " " + it.user.firstName }
        val unconfirmedAuthorNames = publication.unconfirmedAuthors
            .map { it.lastName + " " + it.firstName }
        return (confirmedAuthorNames + unconfirmedAuthorNames).joinToString(postfix = ".")
    }

    private fun publishDate(publication: Publication): String {
        return if (publication.status != PUBLISHED) {
            "Dataset is not published yet."
        } else {
            publication.publicationTime!!.toLocalDate().toString()
        }
    }

    private fun description(publication: Publication): List<String> {
        return if (publication.description.isNullOrEmpty()) {
            return listOf("Draft. No description yet.")
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

    private fun experimentGoals(publication: Publication): List<String> {
        return if (publication.predictedGoals.isNullOrEmpty()) {
            listOf("Draft. No predicted goals yet.")
        } else {
            publication.predictedGoals!!
        }
    }

    private fun negativeData(publication: Publication): String {
        return publication.negativeData!!
    }

    private fun method(publication: Publication): List<String> {
        return if (publication.methodDescription.isNullOrEmpty()) {
            listOf("Draft. No method description yet.")
        } else {
            publication.methodDescription!!
        }
    }

    private fun objectOfStudyName(publication: Publication): String {
        return if (publication.objectOfStudyTitle.isNullOrEmpty()) {
            "Draft. No object of study yet."
        } else {
            publication.objectOfStudyTitle!!
        }
    }

    private fun objectOfStudy(publication: Publication): List<String> {
        return if (publication.objectOfStudyDescription.isNullOrEmpty()) {
            listOf("Draft. No object of study description yet.")
        } else {
            publication.objectOfStudyDescription!!
        }
    }

    private fun software(publication: Publication): List<String> {
        return publication.software!!
    }

    private fun authorsDescriptions(publication: Publication): List<AuthorDescription> {
        return (
            publication.confirmedAuthors
                .associate {
                    it.user.lastName + " " + it.user.firstName to (it.user.workplaces.joinToString(", ") { workplace -> "${workplace.organization.name} ${workplace.organizationDepartment?.name}" }
                        ?: "")
                } +
                publication.unconfirmedAuthors.associate
                {
                    it.lastName + " " + it.firstName to (it.workplaces.joinToString(", ") { workplace -> "${workplace.organization.name} ${workplace.organizationDepartment?.name}" }
                        ?: "")
                })
            .map { AuthorDescription(it.key, it.value) }
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
