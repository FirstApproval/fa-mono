package org.firstapproval.backend.core.domain.pdf

import com.itextpdf.kernel.events.Event
import com.itextpdf.kernel.events.IEventHandler
import com.itextpdf.kernel.events.PdfDocumentEvent
import com.itextpdf.kernel.geom.Rectangle
import com.itextpdf.kernel.pdf.canvas.PdfCanvas
import com.itextpdf.layout.Canvas
import com.itextpdf.layout.Style
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.properties.TextAlignment


class PdfFooter : IEventHandler {
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

        pdfCanvas.moveTo(30.0, 40.0)
        pdfCanvas.lineTo((pageSize.width - 30).toDouble(), 40.0)
        pdfCanvas.closePathStroke()

        val pageNumber = pdf.getPageNumber(page)
        val footerText = Paragraph()
        val alignment: TextAlignment
        val position: Float
        if (pageNumber % 2 != 0) {
            footerText.add("First Approval  •  firstapproval.io  |  $pageNumber")
            alignment = TextAlignment.RIGHT
            position = pageSize.width - 30
        } else {
            footerText.add("$pageNumber  |  First Approval  •  firstapproval.io")
            alignment = TextAlignment.LEFT
            position = 30f
        }

        val s = Style()
        s.setFontSize(12f)
        s.setMarginTop(10f)
        s.setPaddings(4f, 5f, 10f, 4f)
        footerText.addStyle(s)

        canvas.showTextAligned(
            footerText,
            position,
            10f,
            alignment
        )
    }
}
