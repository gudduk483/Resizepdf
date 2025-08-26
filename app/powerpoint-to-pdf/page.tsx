"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, Presentation } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PowerPointToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null)

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PowerPoint file to convert.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/powerpoint-to-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to convert PowerPoint to PDF")
      }

      const blob = await response.blob()
      setConvertedFile(blob)

      toast({
        title: "Success",
        description: "PowerPoint converted to PDF successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PowerPoint to PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile)
      const link = document.createElement("a")
      link.href = url
      link.download = `${selectedFile?.name?.replace(/\.(pptx?|pps)$/i, "") || "presentation"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setConvertedFile(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!convertedFile ? (
            <>
              <FileUpload
                accept={{
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
                  "application/vnd.ms-powerpoint": [".ppt"],
                }}
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="PowerPoint to PDF"
                description="Convert PowerPoint presentations to PDF format for easy sharing."
                buttonText="Select PowerPoint file"
              />

              {selectedFile && (
                <div className="text-center mt-8">
                  <Button size="lg" onClick={handleConvert} disabled={isProcessing} className="min-w-32">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Presentation className="h-4 w-4 mr-2" />
                        Convert to PDF
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Presentation className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
                  <p className="text-muted-foreground mb-6">Your PowerPoint has been converted to PDF format.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Convert Another Presentation
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
