package org.firstapproval.backend.core.infra.pdf

import com.lowagie.text.pdf.BaseFont
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import org.xhtmlrenderer.pdf.ITextRenderer
import java.io.ByteArrayOutputStream


@Service
class PdfService(
    private val templateEngine: SpringTemplateEngine,
) {

    fun generate(templateName: String, templateContext: Context): ByteArray {
        val outputStream = ByteArrayOutputStream()
        val html = templateEngine.process(templateName, templateContext)

        val renderer = ITextRenderer()
        renderer.fontResolver.addFont("templates/pdf/Roboto-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED)
        renderer.setDocumentFromString(html)
        renderer.layout()
        renderer.createPDF(outputStream)
        outputStream.close()
        return outputStream.toByteArray()
    }
}
