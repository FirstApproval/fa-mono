package org.firstapproval.backend.core.infra.pdf

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import org.apache.commons.io.IOUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream


@Service
class PdfService(
    private val templateEngine: SpringTemplateEngine,
    @Value("classpath:templates/pdf/Roboto-Regular.ttf")
    private val template: Resource
) {

    private final val fonts: File = File.createTempFile("Roboto.ttf", "tmp")
    init {
        FileOutputStream(fonts).use { outputStream -> IOUtils.copy(template.inputStream, outputStream) }
    }

    fun generate(templateName: String, templateContext: Context): ByteArray {
        val htmlContent = templateEngine.process(templateName, templateContext)
        ByteArrayOutputStream().use { os ->
            val builder = PdfRendererBuilder()

            builder.useFont(fonts, "Roboto")
            builder.useFastMode()
            builder.withHtmlContent(htmlContent, null)
            builder.toStream(os)
            builder.run()
            return os.toByteArray()
        }
    }
}
