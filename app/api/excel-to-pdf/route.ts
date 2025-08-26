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
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    // Title
    page.drawText("Excel to PDF Conversion", {
      x: 50,
      y: height - 50,
      size: 18,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    })

    // File info
    page.drawText(`Original File: ${file.name}`, {
      x: 50,
      y: height - 80,
      size: 12,
      font: courierFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(`File Size: ${(file.size / 1024).toFixed(2)} KB`, {
      x: 50,
      y: height - 100,
      size: 12,
      font: courierFont,
      color: rgb(0, 0, 0),
    })

    page.drawText(`Converted: ${new Date().toLocaleString()}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font: courierFont,
      color: rgb(0, 0, 0),
    })

    // Sample table representation
    const tableData = [
      ["Column A", "Column B", "Column C", "Column D"],
      ["Data 1", "Data 2", "Data 3", "Data 4"],
      ["Value 1", "Value 2", "Value 3", "Value 4"],
      ["Item 1", "Item 2", "Item 3", "Item 4"],
    ]

    let yPosition = height - 180
    const cellWidth = 100
    const cellHeight = 20

    // Draw table
    page.drawText("Sample Data Table:", {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    })

    yPosition -= 30

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = 50 + colIndex * cellWidth
        const y = yPosition - rowIndex * cellHeight

        // Draw cell border
        page.drawRectangle({
          x,
          y: y - cellHeight + 5,
          width: cellWidth,
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        })

        // Draw cell text
        page.drawText(cell, {
          x: x + 5,
          y: y - 10,
          size: 10,
          font: courierFont,
          color: rgb(0, 0, 0),
        })
      })
    })

    // Note
    page.drawText(
      `Note: This is a demo implementation. In production, you would use
libraries like xlsx or exceljs to parse spreadsheet data and
recreate the layout with proper formatting, formulas, and charts.`,
      {
        x: 50,
        y: height - 350,
        size: 10,
        font: courierFont,
        color: rgb(0.5, 0.5, 0.5),
        maxWidth: width - 100,
      },
    )

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.(xlsx?|xls)$/i, "")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error converting Excel to PDF:", error)
    return NextResponse.json({ error: "Failed to convert Excel to PDF" }, { status: 500 })
  }
}
