package org.firstapproval.backend.core.external.doi

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.DoiProperties
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.publication.authors.Author
import org.firstapproval.backend.core.domain.user.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import org.w3c.dom.Document
import org.w3c.dom.Element
import org.w3c.dom.Node
import java.io.StringWriter
import java.time.ZonedDateTime.now
import java.time.format.DateTimeFormatter
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.OutputKeys.*
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult

val CROSSREF_TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")!!

@Service
class DoiXmlBuilder(
    private val doiProperties: DoiProperties,
    @Value("classpath:doi/dataset.5.3.0.xml") private val datasetXmlTemplate: Resource
) {
    val log = logger { }

    fun build(publication: Publication, doiId: String): String { val filePath = "doi/dataset.5.3.0.xml" // Путь к вашему XML-файлу
        val docBuilderFactory = DocumentBuilderFactory.newInstance()
        val docBuilder = docBuilderFactory.newDocumentBuilder()
        val doc = docBuilder.parse(datasetXmlTemplate.inputStream)

        // Включаем изменения в документе
        val rootElement = doc.documentElement

        val headNode = doc.getElementsByTagName("head").item(0) as Element
        headNode.getElementsByTagName("doi_batch_id").item(0).textContent = doiId
        headNode.getElementsByTagName("timestamp").item(0).textContent = now().format(CROSSREF_TIMESTAMP_FORMATTER)

        // Map XML fields to corresponding Publication fields in body section
        val bodyNode = doc.getElementsByTagName("body").item(0) as Element
        val datasetNode = bodyNode.getElementsByTagName("dataset").item(0) as Element

        // Map dataset fields
        val titles = datasetNode.getElementsByTagName("titles").item(0) as Element
        titles.getElementsByTagName("title").item(0).textContent = publication.title!!

        val databaseDateNode = datasetNode.getElementsByTagName("database_date").item(0) as Element
        val creationDateNode = databaseDateNode.getElementsByTagName("creation_date").item(0) as Element
        val creationMonthNode = creationDateNode.getElementsByTagName("month").item(0) as Element
        creationMonthNode.textContent = publication.creationTime.monthValue.toString()
        val creationDayNode = creationDateNode.getElementsByTagName("day").item(0) as Element
        creationDayNode.textContent = publication.creationTime.dayOfMonth.toString()
        val creationYearNode = creationDateNode.getElementsByTagName("year").item(0) as Element
        creationYearNode.textContent = publication.creationTime.year.toString()

        val publicationDateNode = databaseDateNode.getElementsByTagName("publication_date").item(0) as Element
        val publicationMonthNode = publicationDateNode.getElementsByTagName("month").item(0) as Element
        publicationMonthNode.textContent = publication.publicationTime!!.monthValue.toString()
        val publicationDayNode = publicationDateNode.getElementsByTagName("day").item(0) as Element
        publicationDayNode.textContent = publication.publicationTime!!.dayOfMonth.toString()
        val publicationYearNode = publicationDateNode.getElementsByTagName("year").item(0) as Element
        publicationYearNode.textContent = publication.publicationTime!!.year.toString()

        datasetNode.getElementsByTagName("description").item(0).textContent = publication.description ?: ""

        val doiData = datasetNode.getElementsByTagName("doi_data").item(0) as Element
        doiData.getElementsByTagName("doi").item(0).textContent = doiId
        doiData.getElementsByTagName("resource").item(0).textContent = doiProperties.doiDataResourceTemplate.format(publication.id)

        val contributorsNode = datasetNode.getElementsByTagName("contributors").item(0) as Element
        publication.authors.forEach {
            val personName = createPersonName(doc, it, publication.creator)
            contributorsNode.appendChild(personName)
        }

        // Write the modified content into a string
        val transformerFactory = TransformerFactory.newInstance()
        val transformer = transformerFactory.newTransformer()
        transformer.setOutputProperty(OMIT_XML_DECLARATION, "no")
        transformer.setOutputProperty(METHOD, "xml")
        transformer.setOutputProperty(INDENT, "yes")
        transformer.setOutputProperty(ENCODING, "UTF-8")
        val writer = StringWriter()
        transformer.transform(DOMSource(doc), StreamResult(writer))

        return writer.toString()
    }

    fun createPersonName(doc: Document, author: Author, creator: User): Node {
        val newPersonNameNode = doc.createElement("person_name")

        val sequence = if (author.user?.id == creator.id) "first" else "additional"
        newPersonNameNode.setAttribute("sequence", sequence)
        newPersonNameNode.setAttribute("contributor_role", "author")

        // Create and set values for given_name and surname elements
        val givenNameNode = doc.createElement("given_name")
        givenNameNode.textContent = author.firstName
        val surnameNode = doc.createElement("surname")
        surnameNode.textContent = author.lastName

        // Append given_name and surname elements to newPersonNameNode
        newPersonNameNode.appendChild(givenNameNode)
        newPersonNameNode.appendChild(surnameNode)

        // Create affiliations element and set values
        val affiliationsNode = doc.createElement("affiliations")

        author.workplaces.forEach {
            // Create institution element and set values
            val institutionNode = doc.createElement("institution")

            val institutionNameNode = doc.createElement("institution_name")
            institutionNameNode.textContent = it.organization.name // Set the organization name here
            institutionNode.appendChild(institutionNameNode)

            it.organizationDepartment?.let { department ->
                val institutionDepartmentNode = doc.createElement("institution_department")
                institutionDepartmentNode.textContent = department
                institutionNode.appendChild(institutionDepartmentNode)
            }

            affiliationsNode.appendChild(institutionNode)
        }

        // Append institutionNode to affiliationsNode
        newPersonNameNode.appendChild(affiliationsNode)

        return newPersonNameNode
    }
}
