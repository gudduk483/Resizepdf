"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileImage, Upload, Download, X } from "lucide-react"

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string>("")
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))
    setFiles((prev) => [...prev, ...imageFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/jpg-to-pdf", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setIsComplete(true)
      } else {
        throw new Error("Conversion failed")
      }
    } catch (error) {
      console.error("Error converting images:", error)
      alert("Error converting images. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTool = () => {
    setFiles([])
    setIsProcessing(false)
    setIsComplete(false)
    setDownloadUrl("")
    setProgress(0)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 px-4">
          <div className="container max-w-2xl">
            <div className="text-center mb-8">
              <FileImage className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Conversion Complete!</h1>
              <p className="text-muted-foreground">Your images have been successfully converted to PDF.</p>
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">converted-images.pdf</h3>
                  <p className="text-sm text-muted-foreground">Ready for download</p>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <a href={downloadUrl} download="converted-images.pdf">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                  <Button variant="outline" onClick={resetTool} className="w-full bg-transparent">
                    Convert More Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <FileImage className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">JPG to PDF</h1>
            <p className="text-muted-foreground">Convert your JPG images to PDF format quickly and easily.</p>
          </div>

          <Card>
            <CardContent className="p-6">
              {files.length === 0 ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select JPG images</h3>
                  <p className="text-muted-foreground mb-4">Choose one or more JPG images to convert to PDF</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <Button asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      Select Images
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Selected Images ({files.length})</h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="add-more"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="add-more" className="cursor-pointer">
                        Add More
                      </label>
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileImage className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Converting images...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Button onClick={handleConvert} disabled={isProcessing} className="w-full">
                    {isProcessing ? "Converting..." : "Convert to PDF"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
