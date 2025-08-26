import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const imageBytes = await file.arrayBuffer()

      let image
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        image = await pdfDoc.embedJpg(imageBytes)
      } else if (file.type === "image/png") {
        image = await pdfDoc.embedPng(imageBytes)
      } else {
        // Convert other formats to JPEG-like handling
        image = await pdfDoc.embedJpg(imageBytes)
      }

      // Add a page with the image
      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted-images.pdf"',
      },
    })
  } catch (error) {
    console.error("Error converting images to PDF:", error)
    return NextResponse.json({ error: "Failed to convert images" }, { status: 500 })
  }
}
