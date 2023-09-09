package org.firstapproval.backend.core.domain.pdf

import com.itextpdf.io.image.ImageDataFactory
import com.itextpdf.kernel.colors.ColorConstants.BLACK
import com.itextpdf.kernel.colors.ColorConstants.WHITE
import com.itextpdf.kernel.events.Event
import com.itextpdf.kernel.events.IEventHandler
import com.itextpdf.kernel.events.PdfDocumentEvent
import com.itextpdf.kernel.geom.Rectangle
import com.itextpdf.kernel.pdf.canvas.PdfCanvas
import com.itextpdf.layout.Canvas
import com.itextpdf.layout.Style
import com.itextpdf.layout.element.Image
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.properties.TextAlignment

class PdfHeader(private val isNegative: Boolean) : IEventHandler {
    override fun handleEvent(event: Event) {
        val docEvent = event as PdfDocumentEvent
        val pdf = docEvent.document
        val page = docEvent.page
        val pageSize: Rectangle = page.pageSize
        val pdfCanvas = PdfCanvas(
            page.lastContentStream, page.resources, pdf
        )
        val canvas = Canvas(pdfCanvas, pageSize)
        canvas.setFontSize(18f)
        val pageNumber = pdf.getPageNumber(page)
        val imagePath: String
        val logoPosition: Float
        val logoSide: Float
        if (pageNumber == 1) {
            imagePath = "classpath:/pdf/logo.png"
            logoPosition = 30f
            logoSide = 100f
            val negativeData = Paragraph("Negative data")
            val s = Style()
            s.setFontSize(12f)
            s.setFontColor(WHITE)
            s.setBackgroundColor(BLACK)
            s.setWidth(75f)
            s.setPaddings(4f, 5f, 4f, 5f)
            negativeData.addStyle(s)
            canvas.showTextAligned(
                if (isNegative) {
                    negativeData
                } else Paragraph(),
                pageSize.width - 30,
                pageSize.top - 30,
                TextAlignment.RIGHT
            )
        } else {
            imagePath = "classpath:/pdf/logo_short.png"
            logoSide = 15f
            logoPosition = if (pageNumber % 2 == 0) pageSize.width - 45f else 35f
        }
        val image = Image(ImageDataFactory.create(imagePath))
        image.scaleToFit(logoSide, logoSide)
        image.setFixedPosition(
            logoPosition,
            pageSize.top - 30f
        )
        image.setMarginBottom(40f)
        canvas.add(image)

        pdfCanvas.moveTo(30.0, (pageSize.top - 30).toDouble())
        pdfCanvas.lineTo((pageSize.width - 30).toDouble(), (pageSize.top - 30).toDouble())
        pdfCanvas.closePathStroke()
    }
}


