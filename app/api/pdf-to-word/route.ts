import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    // Extract text from PDF (simplified implementation)
    // In a real implementation, you would use a proper PDF text extraction library
    let extractedText = "This is a simulated Word document conversion.\n\n"
    extractedText += `Original PDF: ${file.name}\n`
    extractedText += `Pages: ${pdf.getPageCount()}\n`
    extractedText += `Converted on: ${new Date().toLocaleString()}\n\n`
    extractedText +=
      "Note: This is a demo implementation. In production, you would use libraries like pdf2pic, pdf-parse, or commercial APIs for accurate text extraction and Word document generation."

    const textBlob = new Blob([extractedText], { type: "text/plain" })

    return new NextResponse(textBlob, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", ".txt")}"`,
      },
    })
  } catch (error) {
    console.error("Error converting PDF to Word:", error)
    return NextResponse.json({ error: "Failed to convert PDF to Word" }, { status: 500 })
  }
}
