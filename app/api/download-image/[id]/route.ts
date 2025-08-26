import { type NextRequest, NextResponse } from "next/server"

// Access the same storage as pdf-to-jpg route
const convertedImages = new Map<string, { filename: string; data: Buffer }>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const imageData = convertedImages.get(id)

    if (!imageData) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
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
