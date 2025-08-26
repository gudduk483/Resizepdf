import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">About Resize PDF</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8 text-center">
              Your trusted partner for all PDF manipulation needs
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  We believe that working with PDFs should be simple, fast, and accessible to everyone. Our mission is
                  to provide professional-grade PDF tools that are completely free and easy to use.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
                <p className="text-muted-foreground">
                  With over 15 different PDF tools, we offer the most comprehensive suite of PDF utilities available
                  online. All tools work directly in your browser with no software installation required.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Features</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  100% Free to use
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  No registration required
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Secure file processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Fast and reliable
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Works on all devices
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Professional quality results
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
