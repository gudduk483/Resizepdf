import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add a page
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    // Add content (in production, you'd parse the Word document)
    const fontSize = 12
    const text = `Word to PDF Conversion

Original File: ${file.name}
File Size: ${(file.size / 1024).toFixed(2)} KB
Converted: ${new Date().toLocaleString()}

This is a demo implementation of Word to PDF conversion.
In a production environment, you would use libraries like:
- mammoth.js for parsing Word documents
- docx-parser for extracting content
- Commercial APIs for high-fidelity conversion

The converted content would preserve:
- Text formatting
- Images and graphics
- Tables and layouts
- Headers and footers
- Page breaks and margins

Note: This demo creates a simple PDF with basic information
about the uploaded Word document.`

    page.drawText(text, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
    })

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.(docx?|rtf)$/i, "")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error converting Word to PDF:", error)
    return NextResponse.json({ error: "Failed to convert Word to PDF" }, { status: 500 })
  }
}
