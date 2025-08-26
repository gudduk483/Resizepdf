"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileCheck, Upload, Download, Sparkles } from "lucide-react"

export default function EnhancePdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [enhanceType, setEnhanceType] = useState("quality")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string>("")
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    }
  }

  const handleEnhance = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("enhanceType", enhanceType)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const response = await fetch("/api/enhance-pdf", {
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
        throw new Error("Enhancement failed")
      }
    } catch (error) {
      console.error("Error enhancing PDF:", error)
      alert("Error enhancing PDF. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTool = () => {
    setFile(null)
    setEnhanceType("quality")
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
              <Sparkles className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Enhancement Complete!</h1>
              <p className="text-muted-foreground">Your PDF has been successfully enhanced.</p>
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">enhanced-{file?.name}</h3>
                  <p className="text-sm text-muted-foreground">Ready for download</p>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <a href={downloadUrl} download={`enhanced-${file?.name}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Enhanced PDF
                    </a>
                  </Button>
                  <Button variant="outline" onClick={resetTool} className="w-full bg-transparent">
                    Enhance Another PDF
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
            <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Enhance PDF</h1>
            <p className="text-muted-foreground">Improve PDF quality and optimize for better viewing experience.</p>
          </div>

          <Card>
            <CardContent className="p-6">
              {!file ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select PDF file</h3>
                  <p className="text-muted-foreground mb-4">Choose a PDF file to enhance</p>
                  <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="file-input" />
                  <Button asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      Select PDF
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileCheck className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Enhancement Options</h3>
                    <RadioGroup value={enhanceType} onValueChange={setEnhanceType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quality" id="quality" />
                        <Label htmlFor="quality">Improve Image Quality</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="text" />
                        <Label htmlFor="text">Enhance Text Clarity</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="optimize" id="optimize" />
                        <Label htmlFor="optimize">Optimize for Web</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">Complete Enhancement</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enhancing PDF...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Button onClick={handleEnhance} disabled={isProcessing} className="w-full">
                    {isProcessing ? "Enhancing..." : "Enhance PDF"}
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
