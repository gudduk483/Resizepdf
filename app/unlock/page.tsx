"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Loader2, Unlock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function UnlockPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [unlockedFile, setUnlockedFile] = useState<Blob | null>(null)
  const [password, setPassword] = useState("")

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleUnlock = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to unlock.",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter the password.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("password", password)

      const response = await fetch("/api/unlock-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Incorrect password")
        }
        throw new Error("Failed to unlock PDF")
      }

      const blob = await response.blob()
      setUnlockedFile(blob)

      toast({
        title: "Success",
        description: "PDF unlocked successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unlock PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (unlockedFile) {
      const url = URL.createObjectURL(unlockedFile)
      const link = document.createElement("a")
      link.href = url
      link.download = `unlocked-${selectedFile?.name || "document.pdf"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUnlockedFile(null)
    setPassword("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!unlockedFile ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="Unlock PDF"
                description="Remove password protection from your PDF files."
                buttonText="Select PDF file"
              />

              {selectedFile && (
                <Card className="max-w-md mx-auto mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Enter Password</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="password">PDF Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter the PDF password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnlock()
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <Button size="lg" onClick={handleUnlock} disabled={isProcessing} className="min-w-32">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Unlocking...
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Unlock PDF
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
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Unlock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Unlocked Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Password protection has been removed from your PDF.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Unlocked PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Unlock Another PDF
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
