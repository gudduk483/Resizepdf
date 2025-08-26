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

    // Create a simple text representation (in production, you'd create a proper .pptx file)
    let presentationContent = "PDF to PowerPoint Conversion\n\n"
    presentationContent += `Slide 1: Title Slide\n`
    presentationContent += `Original PDF: ${file.name}\n`
    presentationContent += `Pages: ${pdf.getPageCount()}\n\n`
    presentationContent += `Slide 2: Content\n`
    presentationContent += `Converted on: ${new Date().toLocaleString()}\n\n`
    presentationContent += `Note: This is a demo implementation. In production, you would use libraries like officegen or commercial APIs for proper PowerPoint generation.`

    const textBlob = new Blob([presentationContent], { type: "text/plain" })

    return new NextResponse(textBlob, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", ".txt")}"`,
      },
    })
  } catch (error) {
    console.error("Error converting PDF to PowerPoint:", error)
    return NextResponse.json({ error: "Failed to convert PDF to PowerPoint" }, { status: 500 })
  }
}
