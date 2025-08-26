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
    const pageCount = pdf.getPageCount()

    return NextResponse.json({ pageCount })
  } catch (error) {
    console.error("Error getting page count:", error)
    return NextResponse.json({ error: "Failed to get page count" }, { status: 500 })
  }
}
