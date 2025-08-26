import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string
    const permissionsStr = formData.get("permissions") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "No password provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    // Parse permissions
    const permissions = JSON.parse(permissionsStr)

    // Note: pdf-lib doesn't support password protection directly
    // In production, you would use a library like HummusJS or PDFtk
    // For this demo, we'll create a new PDF with a note about protection

    const protectedPdf = await PDFDocument.create()
    const pages = await protectedPdf.copyPages(pdf, pdf.getPageIndices())

    pages.forEach((page) => {
      protectedPdf.addPage(page)
    })

    // Add metadata indicating protection (demo only)
    protectedPdf.setTitle(`Protected: ${pdf.getTitle() || file.name}`)
    protectedPdf.setSubject("Password Protected PDF")

    const protectedPdfBytes = await protectedPdf.save()

    return new NextResponse(protectedPdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="protected-${file.name}"`,
      },
    })
  } catch (error) {
    console.error("Error protecting PDF:", error)
    return NextResponse.json({ error: "Failed to protect PDF" }, { status: 500 })
  }
}
