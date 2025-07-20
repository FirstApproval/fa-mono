package org.firstapproval.backend.core.infra.pdf

import org.docx4j.Docx4J
import org.docx4j.convert.out.FOSettings
import org.docx4j.model.fields.merge.DataFieldName
import org.docx4j.model.fields.merge.MailMerger
import org.docx4j.model.fields.merge.MailMerger.performMerge
import org.docx4j.model.fields.merge.MailMerger.setMERGEFIELDInOutput
import org.docx4j.openpackaging.packages.WordprocessingMLPackage
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream

@Service
class DocxPdfGenerator {
    fun generate(templatePath: String, params: Map<String, String>): Resource {
        val templateStream = ClassPathResource(templatePath).inputStream

        val wordMLPackage = WordprocessingMLPackage.load(templateStream)
        val preparedParams = params.map { entry -> DataFieldName(entry.key) to entry.value }.toMap()

        setMERGEFIELDInOutput(MailMerger.OutputField.REMOVED)
        performMerge(wordMLPackage, preparedParams, true)

        val foSettings = FOSettings()
        foSettings.opcPackage = wordMLPackage

        val outputStream = ByteArrayOutputStream()
        Docx4J.toFO(foSettings, outputStream, Docx4J.FLAG_EXPORT_PREFER_XSL)

        return InputStreamResource(outputStream.toByteArray().inputStream())
    }
//
//    private fun replacePlaceholders(wordMLPackage: WordprocessingMLPackage, variables: Map<String, String>) {
//        val texts = wordMLPackage.mainDocumentPart.jaxbElement.body
//            .content
//            .flatMap {
//                when (it) {
//                    is org.docx4j.wml.P -> it.content
//                    else -> listOf(it)
//                }
//            }
//            .filterIsInstance(org.docx4j.wml.R::class.java)
//            .flatMap { it.content }
//            .filterIsInstance(Text::class.java)
//
//        for (text in texts) {
//            for ((key, value) in variables) {
//                if (text.value.contains("{{${key}}}")) {
//                    text.value = text.value.replace("{{${key}}}", value)
//                }
//            }
//        }
//    }
}
