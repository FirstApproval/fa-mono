package org.firstapproval.backend.core.infra.pdf

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.io.ByteArrayOutputStream

@Service
class PdfService(
    private val templateEngine: SpringTemplateEngine,
) {

    fun generate(templateName: String, templateContext: Context): ByteArray {
        val htmlContent = templateEngine.process(templateName, templateContext)
        ByteArrayOutputStream().use { os ->
            val builder = PdfRendererBuilder()
            builder.useFastMode()
            builder.withHtmlContent(htmlContent, null)
            builder.toStream(os)
            builder.run()
            return os.toByteArray()
        }
    }
}