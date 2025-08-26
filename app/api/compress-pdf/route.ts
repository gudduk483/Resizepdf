import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const level = formData.get("level") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    // Get compression settings based on level
    let compressionSettings: any = {}

    switch (level) {
      case "low":
        compressionSettings = {
          useObjectStreams: false,
          addDefaultPage: false,
        }
        break
      case "medium":
        compressionSettings = {
          useObjectStreams: true,
          addDefaultPage: false,
        }
        break
      case "high":
        compressionSettings = {
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
        }
        break
      default:
        compressionSettings = {
          useObjectStreams: true,
          addDefaultPage: false,
        }
    }

    // For high compression, we can also remove metadata and optimize images
    if (level === "high") {
      // Remove metadata to reduce file size
      pdf.setTitle("")
      pdf.setAuthor("")
      pdf.setSubject("")
      pdf.setKeywords([])
      pdf.setProducer("")
      pdf.setCreator("")
    }

    // Save with compression settings
    const compressedPdfBytes = await pdf.save(compressionSettings)

    return new NextResponse(compressedPdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed-${file.name}"`,
      },
    })
  } catch (error) {
    console.error("Error compressing PDF:", error)
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 })
  }
}
