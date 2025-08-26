"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Loader2, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ProtectPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [protectedFile, setProtectedFile] = useState<Blob | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    editing: true,
    commenting: true,
  })

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleProtect = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to protect.",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("password", password)
      formData.append("permissions", JSON.stringify(permissions))

      const response = await fetch("/api/protect-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to protect PDF")
      }

      const blob = await response.blob()
      setProtectedFile(blob)

      toast({
        title: "Success",
        description: "PDF protected with password successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to protect PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (protectedFile) {
      const url = URL.createObjectURL(protectedFile)
      const link = document.createElement("a")
      link.href = url
      link.download = `protected-${selectedFile?.name || "document.pdf"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setProtectedFile(null)
    setPassword("")
    setConfirmPassword("")
    setPermissions({
      printing: true,
      copying: true,
      editing: true,
      commenting: true,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container">
          {!protectedFile ? (
            <>
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                selectedFiles={selectedFile ? [selectedFile] : []}
                onRemoveFile={handleRemoveFile}
                title="Protect PDF"
                description="Add password protection to secure your PDF documents."
                buttonText="Select PDF file"
              />

              {selectedFile && (
                <Card className="max-w-2xl mx-auto mt-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Security Settings</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Permissions</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="printing"
                              checked={permissions.printing}
                              onCheckedChange={(checked) =>
                                setPermissions((prev) => ({ ...prev, printing: !!checked }))
                              }
                            />
                            <Label htmlFor="printing">Allow printing</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="copying"
                              checked={permissions.copying}
                              onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, copying: !!checked }))}
                            />
                            <Label htmlFor="copying">Allow copying text</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="editing"
                              checked={permissions.editing}
                              onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, editing: !!checked }))}
                            />
                            <Label htmlFor="editing">Allow editing</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="commenting"
                              checked={permissions.commenting}
                              onCheckedChange={(checked) =>
                                setPermissions((prev) => ({ ...prev, commenting: !!checked }))
                              }
                            />
                            <Label htmlFor="commenting">Allow commenting</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <Button size="lg" onClick={handleProtect} disabled={isProcessing} className="min-w-32">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Protecting...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Protect PDF
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
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">PDF Protected Successfully!</h2>
                  <p className="text-muted-foreground mb-6">Your PDF is now password protected and secure.</p>
                  <div className="space-y-3">
                    <Button size="lg" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Protected PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                      Protect Another PDF
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
