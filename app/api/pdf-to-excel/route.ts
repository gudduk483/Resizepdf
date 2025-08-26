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

    let csvContent = "Column A,Column B,Column C\n"
    csvContent += `"Original PDF","${file.name}","${pdf.getPageCount()} pages"\n`
    csvContent += `"Converted on","${new Date().toLocaleString()}","Demo"\n`
    csvContent += `"Note","This is a demo implementation","Use proper libraries in production"\n`

    const csvBlob = new Blob([csvContent], { type: "text/csv" })

    return new NextResponse(csvBlob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", ".csv")}"`,
      },
    })
  } catch (error) {
    console.error("Error converting PDF to Excel:", error)
    return NextResponse.json({ error: "Failed to convert PDF to Excel" }, { status: 500 })
  }
}
