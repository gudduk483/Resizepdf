import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files: File[] = []

    // Extract all files from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 PDF files are required" }, { status: 400 })
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create()

    // Process each file
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

      pages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    }

    // Generate the merged PDF
    const pdfBytes = await mergedPdf.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged-document.pdf"',
      },
    })
  } catch (error) {
    console.error("Error merging PDFs:", error)
    return NextResponse.json({ error: "Failed to merge PDFs" }, { status: 500 })
  }
}
