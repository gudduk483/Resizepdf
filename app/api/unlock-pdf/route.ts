import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "No password provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()

    // Note: pdf-lib doesn't support password-protected PDFs directly
    // In production, you would use libraries like PDF2pic, PDFtk, or commercial APIs
    // For this demo, we'll simulate password checking

    // Simulate password validation (demo only)
    if (password.length < 3) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    try {
      const pdf = await PDFDocument.load(arrayBuffer)

      // Create unlocked version
      const unlockedPdf = await PDFDocument.create()
      const pages = await unlockedPdf.copyPages(pdf, pdf.getPageIndices())

      pages.forEach((page) => {
        unlockedPdf.addPage(page)
      })

      // Remove protection metadata
      unlockedPdf.setTitle(pdf.getTitle()?.replace("Protected: ", "") || file.name)
      unlockedPdf.setSubject("Unlocked PDF")

      const unlockedPdfBytes = await unlockedPdf.save()

      return new NextResponse(unlockedPdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="unlocked-${file.name}"`,
        },
      })
    } catch (error) {
      // If PDF loading fails, assume it's due to password protection
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error unlocking PDF:", error)
    return NextResponse.json({ error: "Failed to unlock PDF" }, { status: 500 })
  }
}
