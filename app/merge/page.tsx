"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function MergePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [mergedFile, setMergedFile] = useState<string | null>(null)

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      const response = await fetch("/api/merge-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to merge PDFs")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setMergedFile(url)

      toast({
        title: "Success",
        description: "PDFs merged successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDFs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (mergedFile) {
      const link = document.createElement("a")
      link.href = mergedFile
      link.download = "merged-document.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleReset = () => {
    setSelectedFiles([])
    setMergedFile(null)
    if (mergedFile) {
      URL.revokeObjectURL(mergedFile)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!mergedFile ? (
            <>
              <FileUpload
                multiple={true}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFiles}
                onRemoveFile={handleRemoveFile}
                title="Merge PDF files"
                description="Combine PDFs in the order you want with the easiest PDF merger available."
                buttonText="Select PDF files"
              />

              {selectedFiles.length >= 2 && (
                <div className="text-center mt-8">
                  <Button size="lg" onClick={handleMerge} disabled={isProcessing} className="min-w-32">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      "Merge PDF"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Merged Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Your PDF files have been merged into a single document.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Merged PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Merge Another PDF
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
