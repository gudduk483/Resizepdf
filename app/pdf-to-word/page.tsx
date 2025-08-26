"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PdfToWordPage() {
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
        description: "Please select a PDF file to convert.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/pdf-to-word", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to convert PDF to Word")
      }

      const blob = await response.blob()
      setConvertedFile(blob)

      toast({
        title: "Success",
        description: "PDF converted to Word successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to Word. Please try again.",
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
      link.download = `${selectedFile?.name?.replace(".pdf", "") || "document"}.docx`
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
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="PDF to Word"
                description="Convert PDF files to editable Word documents with high accuracy."
                buttonText="Select PDF file"
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
                        <FileText className="h-4 w-4 mr-2" />
                        Convert to Word
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
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
                  <p className="text-muted-foreground mb-6">Your PDF has been converted to Word format.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Word Document
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Convert Another PDF
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
