"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, Loader2, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SplitResult {
  filename: string
  blob: Blob
}

export default function SplitPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
  const [splitMode, setSplitMode] = useState<"all" | "range" | "pages">("all")
  const [pageRange, setPageRange] = useState("")
  const [specificPages, setSpecificPages] = useState("")
  const [totalPages, setTotalPages] = useState<number>(0)

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
      // Get page count
      getPageCount(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setTotalPages(0)
  }

  const getPageCount = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/get-page-count", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setTotalPages(data.pageCount)
      }
    } catch (error) {
      console.error("Error getting page count:", error)
    }
  }

  const handleSplit = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to split.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("mode", splitMode)

      if (splitMode === "range") {
        formData.append("range", pageRange)
      } else if (splitMode === "pages") {
        formData.append("pages", specificPages)
      }

      const response = await fetch("/api/split-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to split PDF")
      }

      const data = await response.json()

      // Download each split file
      const results: SplitResult[] = []
      for (const fileData of data.files) {
        const fileResponse = await fetch(`/api/download-split/${fileData.id}`)
        const blob = await fileResponse.blob()
        results.push({
          filename: fileData.filename,
          blob: blob,
        })
      }

      setSplitResults(results)

      toast({
        title: "Success",
        description: `PDF split into ${results.length} files successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to split PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (result: SplitResult) => {
    const url = URL.createObjectURL(result.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    splitResults.forEach((result) => {
      handleDownload(result)
    })
  }

  const handleReset = () => {
    setSelectedFile(null)
    setSplitResults([])
    setTotalPages(0)
    setPageRange("")
    setSpecificPages("")
    setSplitMode("all")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {splitResults.length === 0 ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="Split PDF file"
                description="Separate one page or a whole set for easy conversion into independent PDF files."
                buttonText="Select PDF file"
              />

              {selectedFile && totalPages > 0 && (
                <Card className="max-w-2xl mx-auto mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Split Options</h3>
                    <p className="text-sm text-muted-foreground mb-4">Total pages: {totalPages}</p>

                    <RadioGroup
                      value={splitMode}
                      onValueChange={(value: "all" | "range" | "pages") => setSplitMode(value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">Split into individual pages</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id="range" />
                        <Label htmlFor="range">Split by page range</Label>
                      </div>
                      {splitMode === "range" && (
                        <div className="ml-6 mt-2">
                          <Input
                            placeholder="e.g., 1-5, 10-15"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            className="max-w-xs"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use format: 1-5, 10-15 (comma separated ranges)
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pages" id="pages" />
                        <Label htmlFor="pages">Extract specific pages</Label>
                      </div>
                      {splitMode === "pages" && (
                        <div className="ml-6 mt-2">
                          <Input
                            placeholder="e.g., 1, 3, 5, 7"
                            value={specificPages}
                            onChange={(e) => setSpecificPages(e.target.value)}
                            className="max-w-xs"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use format: 1, 3, 5, 7 (comma separated page numbers)
                          </p>
                        </div>
                      )}
                    </RadioGroup>

                    <div className="text-center mt-6">
                      <Button size="lg" onClick={handleSplit} disabled={isProcessing} className="min-w-32">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Splitting...
                          </>
                        ) : (
                          "Split PDF"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Split Successfully!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your PDF has been split into {splitResults.length} files.
                  </p>

                  <div className="space-y-3 mb-6">
                    {splitResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-sm">{result.filename}</span>
                        </div>
                        <Button size="sm" onClick={() => handleDownload(result)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownloadAll} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Files
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Split Another PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
