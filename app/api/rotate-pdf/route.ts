import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, degrees } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const rotation = formData.get("rotation") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    const rotationAngle = Number.parseInt(rotation)
    const pages = pdf.getPages()

    // Rotate all pages
    pages.forEach((page) => {
      page.setRotation(degrees(rotationAngle))
    })

    const rotatedPdfBytes = await pdf.save()

    return new NextResponse(rotatedPdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rotated-${file.name}"`,
      },
    })
  } catch (error) {
    console.error("Error rotating PDF:", error)
    return NextResponse.json({ error: "Failed to rotate PDF" }, { status: 500 })
  }
}
