"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Download, Loader2, Minimize2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CompressionResult {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  blob: Blob
}

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium")

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleCompress = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to compress.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("level", compressionLevel)

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to compress PDF")
      }

      const blob = await response.blob()
      const originalSize = selectedFile.size
      const compressedSize = blob.size
      const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

      setCompressionResult({
        originalSize,
        compressedSize,
        compressionRatio,
        blob,
      })

      toast({
        title: "Success",
        description: `PDF compressed successfully! Reduced by ${compressionRatio}%`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (compressionResult) {
      const url = URL.createObjectURL(compressionResult.blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `compressed-${selectedFile?.name || "document.pdf"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setCompressionResult(null)
    setCompressionLevel("medium")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!compressionResult ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="Compress PDF"
                description="Reduce file size while optimizing for maximal PDF quality."
                buttonText="Select PDF file"
              />

              {selectedFile && (
                <Card className="max-w-2xl mx-auto mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Compression Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Original file size: {formatFileSize(selectedFile.size)}
                    </p>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Compression Level</Label>
                      <RadioGroup
                        value={compressionLevel}
                        onValueChange={(value: "low" | "medium" | "high") => setCompressionLevel(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low" className="flex-1">
                            <div>
                              <div className="font-medium">Low Compression</div>
                              <div className="text-sm text-muted-foreground">Best quality, larger file size</div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="flex-1">
                            <div>
                              <div className="font-medium">Medium Compression (Recommended)</div>
                              <div className="text-sm text-muted-foreground">
                                Good balance between quality and file size
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high" className="flex-1">
                            <div>
                              <div className="font-medium">High Compression</div>
                              <div className="text-sm text-muted-foreground">Smallest file size, reduced quality</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="text-center mt-6">
                      <Button size="lg" onClick={handleCompress} disabled={isProcessing} className="min-w-32">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Compressing...
                          </>
                        ) : (
                          <>
                            <Minimize2 className="h-4 w-4 mr-2" />
                            Compress PDF
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Minimize2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Compressed Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Your PDF has been compressed and optimized.</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Original Size:</span>
                        <span className="text-sm">{formatFileSize(compressionResult.originalSize)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Compressed Size:</span>
                        <span className="text-sm">{formatFileSize(compressionResult.compressedSize)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Size Reduction:</span>
                        <span className="text-sm font-bold text-green-600">{compressionResult.compressionRatio}%</span>
                      </div>
                      <Progress value={compressionResult.compressionRatio} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Compressed PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Compress Another PDF
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
