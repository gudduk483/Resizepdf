import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import {
  Combine,
  Split,
  Minimize2,
  FileText,
  FileSpreadsheet,
  Presentation,
  ImageIcon,
  PenTool,
  RotateCcw,
  Lock,
  Unlock,
  FileImage,
  FileCheck,
  Layers,
} from "lucide-react"

export default function HomePage() {
  const tools = [
    {
      title: "JPG to PDF",
      description: "Convert JPG images to PDF format quickly and easily.",
      icon: FileImage,
      href: "/jpg-to-pdf",
      iconColor: "text-white",
      gradientClass: "gradient-accent",
    },
    {
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality JPG images.",
      icon: ImageIcon,
      href: "/pdf-to-jpg",
      iconColor: "text-white",
      gradientClass: "gradient-secondary",
    },
    {
      title: "Split PDF",
      description: "Separate one page or a whole set for easy conversion into independent PDF files.",
      icon: Split,
      href: "/split",
      iconColor: "text-white",
      gradientClass: "gradient-cool",
    },
    {
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document with our easy-to-use PDF merger.",
      icon: Combine,
      href: "/merge",
      iconColor: "text-white",
      gradientClass: "gradient-red",
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      icon: Minimize2,
      href: "/compress",
      iconColor: "text-white",
      gradientClass: "gradient-primary",
    },
    {
      title: "Enhance PDF",
      description: "Improve PDF quality and optimize for better viewing experience.",
      icon: FileCheck,
      href: "/enhance",
      iconColor: "text-white",
      gradientClass: "gradient-purple",
    },
    {
      title: "PDF to Word",
      description: "Convert PDF files to editable Word documents with high accuracy.",
      icon: FileText,
      href: "/pdf-to-word",
      iconColor: "text-white",
      gradientClass: "gradient-accent",
    },
    {
      title: "PDF to PowerPoint",
      description: "Turn your PDF files into editable PowerPoint presentations.",
      icon: Presentation,
      href: "/pdf-to-powerpoint",
      iconColor: "text-white",
      gradientClass: "gradient-red",
    },
    {
      title: "PDF to Excel",
      description: "Convert PDF documents to Excel spreadsheets for data analysis.",
      icon: FileSpreadsheet,
      href: "/pdf-to-excel",
      iconColor: "text-white",
      gradientClass: "gradient-primary",
    },
    {
      title: "Word to PDF",
      description: "Convert Word documents to PDF format while preserving formatting.",
      icon: FileImage,
      href: "/word-to-pdf",
      iconColor: "text-white",
      gradientClass: "gradient-cool",
    },
    {
      title: "PowerPoint to PDF",
      description: "Convert PowerPoint presentations to PDF format for easy sharing.",
      icon: ImageIcon,
      href: "/powerpoint-to-pdf",
      iconColor: "text-white",
      gradientClass: "gradient-warm",
    },
    {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF while maintaining layout.",
      icon: FileCheck,
      href: "/excel-to-pdf",
      iconColor: "text-white",
      gradientClass: "gradient-secondary",
    },
    {
      title: "Rotate PDF",
      description: "Rotate your PDF pages to the correct orientation.",
      icon: RotateCcw,
      href: "/rotate",
      iconColor: "text-white",
      gradientClass: "gradient-purple",
    },
    {
      title: "Unlock PDF",
      description: "Remove password protection from your PDF files.",
      icon: Unlock,
      href: "/unlock",
      iconColor: "text-white",
      gradientClass: "gradient-accent",
    },
    {
      title: "Protect PDF",
      description: "Add password protection to secure your PDF documents.",
      icon: Lock,
      href: "/protect",
      iconColor: "text-white",
      gradientClass: "gradient-red",
    },
    {
      title: "Edit PDF",
      description: "Add text, images, and shapes to your PDF documents online.",
      icon: PenTool,
      href: "/edit",
      iconColor: "text-white",
      gradientClass: "gradient-pink",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 px-4 text-center bg-gradient-to-br from-background via-muted/50 to-primary/5">
          <div className="container max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split,
              compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">✨ 100% Free</div>
              <div className="px-4 py-2 bg-secondary/10 rounded-full text-secondary font-medium">
                🚀 Fast Processing
              </div>
              <div className="px-4 py-2 bg-accent/10 rounded-full text-accent font-medium">🔒 Secure & Private</div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <ToolCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  href={tool.href}
                  iconColor={tool.iconColor}
                  gradientClass={tool.gradientClass}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-r from-muted/30 via-primary/5 to-secondary/5">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Work your way
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FileCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Work offline with Desktop</h3>
                <p className="text-muted-foreground">
                  Work with and manage documents locally, with no internet and no limits.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">On-the-go with Mobile</h3>
                <p className="text-muted-foreground">
                  Your favorite tools, right in your pocket. Keep working on your projects anywhere.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Built for business</h3>
                <p className="text-muted-foreground">
                  Automate document management, process forms easily, and keep your flexible plans.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
