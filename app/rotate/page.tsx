"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, Loader2, RotateCcw, RotateCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function RotatePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rotatedFile, setRotatedFile] = useState<Blob | null>(null)
  const [rotation, setRotation] = useState<"90" | "180" | "270">("90")

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleRotate = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to rotate.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("rotation", rotation)

      const response = await fetch("/api/rotate-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to rotate PDF")
      }

      const blob = await response.blob()
      setRotatedFile(blob)

      toast({
        title: "Success",
        description: `PDF rotated ${rotation}° successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rotate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (rotatedFile) {
      const url = URL.createObjectURL(rotatedFile)
      const link = document.createElement("a")
      link.href = url
      link.download = `rotated-${selectedFile?.name || "document.pdf"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setRotatedFile(null)
    setRotation("90")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!rotatedFile ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="Rotate PDF"
                description="Rotate your PDF pages to the correct orientation."
                buttonText="Select PDF file"
              />

              {selectedFile && (
                <Card className="max-w-2xl mx-auto mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Rotation Options</h3>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Select Rotation Angle</Label>
                      <RadioGroup value={rotation} onValueChange={(value: "90" | "180" | "270") => setRotation(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90" id="90" />
                          <Label htmlFor="90" className="flex items-center gap-2">
                            <RotateCw className="h-4 w-4" />
                            90° Clockwise
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="180" id="180" />
                          <Label htmlFor="180" className="flex items-center gap-2">
                            <RotateCw className="h-4 w-4" />
                            180° (Upside down)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="270" id="270" />
                          <Label htmlFor="270" className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4" />
                            270° Counter-clockwise
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="text-center mt-6">
                      <Button size="lg" onClick={handleRotate} disabled={isProcessing} className="min-w-32">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Rotating...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Rotate PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RotateCcw className="h-8 w-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Rotated Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Your PDF has been rotated {rotation}°.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Rotated PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Rotate Another PDF
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
