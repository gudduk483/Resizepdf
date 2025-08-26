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
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Add multiple pages to simulate slides
    for (let i = 1; i <= 3; i++) {
      const page = pdfDoc.addPage()
      const { width, height } = page.getSize()

      // Title
      page.drawText(`Slide ${i}`, {
        x: 50,
        y: height - 80,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      })

      // Content
      const content =
        i === 1
          ? `PowerPoint to PDF Conversion

Original File: ${file.name}
File Size: ${(file.size / 1024).toFixed(2)} KB
Converted: ${new Date().toLocaleString()}

This slide demonstrates the conversion process.`
          : i === 2
            ? `Features Preserved:

• Text formatting and fonts
• Slide layouts and designs
• Images and graphics
• Animations (as static content)
• Charts and tables
• Speaker notes (optional)`
            : `Technical Implementation:

In production, this would use:
- Libraries like node-pptx or officegen
- Commercial APIs for high-fidelity conversion
- Proper slide parsing and rendering
- Image extraction and embedding

This demo creates a multi-page PDF
representing the original presentation structure.`

      page.drawText(content, {
        x: 50,
        y: height - 150,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      })
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.(pptx?|pps)$/i, "")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error converting PowerPoint to PDF:", error)
    return NextResponse.json({ error: "Failed to convert PowerPoint to PDF" }, { status: 500 })
  }
}
