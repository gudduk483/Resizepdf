import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

const splitFiles = new Map<string, { filename: string; data: Uint8Array; timestamp: number }>()

const cleanupOldFiles = () => {
  const now = Date.now()
  const maxAge = 10 * 60 * 1000 // 10 minutes

  for (const [key, value] of splitFiles.entries()) {
    if (now - value.timestamp > maxAge) {
      splitFiles.delete(key)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const mode = formData.get("mode") as string
    const range = formData.get("range") as string
    const pages = formData.get("pages") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > 100 * 1024 * 1024) {
      // 100MB limit
      return NextResponse.json({ error: "File too large. Maximum size is 100MB." }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const totalPages = pdf.getPageCount()

    const results: { id: string; filename: string }[] = []

    // Clean up old files before processing
    cleanupOldFiles()

    if (mode === "all") {
      // Split into individual pages
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create()
        const [page] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(page)

        const pdfBytes = await newPdf.save()
        const id = `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`
        const filename = `page-${i + 1}.pdf`

        splitFiles.set(id, { filename, data: pdfBytes, timestamp: Date.now() })
        results.push({ id, filename })
      }
    } else if (mode === "range" && range) {
      // Split by ranges
      const ranges = range.split(",").map((r) => r.trim())

      for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
        const currentRange = ranges[rangeIndex]
        const [start, end] = currentRange.split("-").map((n) => Number.parseInt(n.trim()) - 1)

        if (start >= 0 && end < totalPages && start <= end) {
          const newPdf = await PDFDocument.create()
          const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i)
          const copiedPages = await newPdf.copyPages(pdf, pageIndices)

          copiedPages.forEach((page) => newPdf.addPage(page))

          const pdfBytes = await newPdf.save()
          const id = `${Date.now()}-range-${rangeIndex}-${Math.random().toString(36).substr(2, 9)}`
          const filename = `pages-${start + 1}-to-${end + 1}.pdf`

          splitFiles.set(id, { filename, data: pdfBytes, timestamp: Date.now() })
          results.push({ id, filename })
        }
      }
    } else if (mode === "pages" && pages) {
      // Extract specific pages
      const pageNumbers = pages
        .split(",")
        .map((p) => Number.parseInt(p.trim()) - 1)
        .filter((p) => p >= 0 && p < totalPages)

      if (pageNumbers.length > 0) {
        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(pdf, pageNumbers)

        copiedPages.forEach((page) => newPdf.addPage(page))

        const pdfBytes = await newPdf.save()
        const id = `${Date.now()}-specific-${Math.random().toString(36).substr(2, 9)}`
        const filename = `selected-pages.pdf`

        splitFiles.set(id, { filename, data: pdfBytes, timestamp: Date.now() })
        results.push({ id, filename })
      }
    }

    return NextResponse.json({ files: results })
  } catch (error) {
    console.error("Error splitting PDF:", error)
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 })
    }

    const fileData = splitFiles.get(id)
    if (!fileData) {
      return NextResponse.json({ error: "File not found or expired" }, { status: 404 })
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
