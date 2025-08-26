import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

const convertedImages = new Map<string, { filename: string; data: Buffer; timestamp: number }>()

const cleanupOldImages = () => {
  const now = Date.now()
  const maxAge = 10 * 60 * 1000 // 10 minutes

  for (const [key, value] of convertedImages.entries()) {
    if (now - value.timestamp > maxAge) {
      convertedImages.delete(key)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pageCount = pdf.getPageCount()

    const results: { id: string; filename: string }[] = []

    // Clean up old images before processing
    cleanupOldImages()

    // Simulate image conversion (in production, use pdf2pic or similar)
    for (let i = 0; i < pageCount; i++) {
      // Create a simple placeholder image data
      const imageData = Buffer.from(`Simulated JPG data for page ${i + 1} of ${file.name}`)
      const id = `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`
      const filename = `${file.name.replace(".pdf", "")}-page-${i + 1}.jpg`

      convertedImages.set(id, { filename, data: imageData, timestamp: Date.now() })
      results.push({ id, filename })
    }

    return NextResponse.json({ images: results })
  } catch (error) {
    console.error("Error converting PDF to JPG:", error)
    return NextResponse.json({ error: "Failed to convert PDF to JPG" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 })
    }

    const imageData = convertedImages.get(id)
    if (!imageData) {
      return NextResponse.json({ error: "Image not found or expired" }, { status: 404 })
    }

    return new NextResponse(imageData.data, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${imageData.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error downloading image:", error)
    return NextResponse.json({ error: "Failed to download image" }, { status: 500 })
  }
}
