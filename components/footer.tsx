import Link from "next/link"
import { Minimize2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Minimize2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Resize PDF</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional PDF tools for all your document needs. Fast, secure, and completely free.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">PDF Tools</h3>
            <div className="space-y-2 text-sm">
              <Link href="/merge" className="block text-muted-foreground hover:text-foreground">
                Merge PDF
              </Link>
              <Link href="/split" className="block text-muted-foreground hover:text-foreground">
                Split PDF
              </Link>
              <Link href="/compress" className="block text-muted-foreground hover:text-foreground">
                Compress PDF
              </Link>
              <Link href="/jpg-to-pdf" className="block text-muted-foreground hover:text-foreground">
                JPG to PDF
              </Link>
              <Link href="/enhance" className="block text-muted-foreground hover:text-foreground">
                Enhance PDF
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Convert</h3>
            <div className="space-y-2 text-sm">
              <Link href="/pdf-to-word" className="block text-muted-foreground hover:text-foreground">
                PDF to Word
              </Link>
              <Link href="/pdf-to-excel" className="block text-muted-foreground hover:text-foreground">
                PDF to Excel
              </Link>
              <Link href="/pdf-to-powerpoint" className="block text-muted-foreground hover:text-foreground">
                PDF to PowerPoint
              </Link>
              <Link href="/pdf-to-jpg" className="block text-muted-foreground hover:text-foreground">
                PDF to JPG
              </Link>
              <Link href="/word-to-pdf" className="block text-muted-foreground hover:text-foreground">
                Word to PDF
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Resize PDF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
