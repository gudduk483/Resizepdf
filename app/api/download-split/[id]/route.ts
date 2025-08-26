import { type NextRequest, NextResponse } from "next/server"

// Access the same storage as split-pdf route
const splitFiles = new Map<string, { filename: string; data: Uint8Array }>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const fileData = splitFiles.get(id)

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return new NextResponse(fileData.data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileData.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error downloading split file:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
