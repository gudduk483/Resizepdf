"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Loader2, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ConvertedImage {
  filename: string
  blob: Blob
}

export default function PdfToJpgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([])

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

      const response = await fetch("/api/pdf-to-jpg", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to convert PDF to JPG")
      }

      const data = await response.json()

      // Download each image
      const images: ConvertedImage[] = []
      for (const imageData of data.images) {
        const imageResponse = await fetch(`/api/download-image/${imageData.id}`)
        const blob = await imageResponse.blob()
        images.push({
          filename: imageData.filename,
          blob: blob,
        })
      }

      setConvertedImages(images)

      toast({
        title: "Success",
        description: `PDF converted to ${images.length} JPG images successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to JPG. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (image: ConvertedImage) => {
    const url = URL.createObjectURL(image.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = image.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    convertedImages.forEach((image) => {
      handleDownload(image)
    })
  }

  const handleReset = () => {
    setSelectedFile(null)
    setConvertedImages([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {convertedImages.length === 0 ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="PDF to JPG"
                description="Convert PDF pages to high-quality JPG images."
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
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Convert to JPG
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Conversion Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your PDF has been converted to {convertedImages.length} JPG images.
                  </p>

                  <div className="space-y-3 mb-6">
                    {convertedImages.map((image, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-sm">{image.filename}</span>
                        </div>
                        <Button size="sm" onClick={() => handleDownload(image)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownloadAll} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Images
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
