import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Minimize2, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg gradient-primary">
                <Minimize2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-foreground">Resize PDF</span>
            </div>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/" className="px-4 py-2 text-sm font-medium">
                    Home
                  </Link>
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="hover:bg-primary/10 hover:text-primary">
                  PDF Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-80 p-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/merge"
                      className="block p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-red-600">🔗</span> Merge PDF
                    </Link>
                    <Link
                      href="/split"
                      className="block p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-blue-600">✂️</span> Split PDF
                    </Link>
                    <Link
                      href="/compress"
                      className="block p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-green-600">📦</span> Compress PDF
                    </Link>
                    <Link
                      href="/rotate"
                      className="block p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-purple-600">🔄</span> Rotate PDF
                    </Link>
                    <Link
                      href="/protect"
                      className="block p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-orange-600">🔒</span> Protect PDF
                    </Link>
                    <Link
                      href="/unlock"
                      className="block p-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-cyan-600">🔓</span> Unlock PDF
                    </Link>
                    <Link
                      href="/jpg-to-pdf"
                      className="block p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-indigo-600">🖼️</span> JPG to PDF
                    </Link>
                    <Link
                      href="/enhance"
                      className="block p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-pink-600">✨</span> Enhance PDF
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="hover:bg-secondary/10 hover:text-secondary">
                  Convert
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-64 p-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/pdf-to-word"
                      className="block p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-blue-600">📄</span> PDF to Word
                    </Link>
                    <Link
                      href="/pdf-to-excel"
                      className="block p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-green-600">📊</span> PDF to Excel
                    </Link>
                    <Link
                      href="/pdf-to-powerpoint"
                      className="block p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-red-600">📽️</span> PDF to PowerPoint
                    </Link>
                    <Link
                      href="/pdf-to-jpg"
                      className="block p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-purple-600">🖼️</span> PDF to JPG
                    </Link>
                    <Link
                      href="/word-to-pdf"
                      className="block p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-indigo-600">📝</span> Word to PDF
                    </Link>
                    <Link
                      href="/excel-to-pdf"
                      className="block p-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-teal-600">📈</span> Excel to PDF
                    </Link>
                    <Link
                      href="/powerpoint-to-pdf"
                      className="block p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="text-orange-600">🎨</span> PowerPoint to PDF
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button variant="ghost" asChild className="hover:bg-accent/10 hover:text-accent">
                  <Link href="/about" className="px-4 py-2 text-sm font-medium">
                    About
                  </Link>
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button variant="ghost" asChild className="hover:bg-accent/10 hover:text-accent">
                  <Link href="/contact" className="px-4 py-2 text-sm font-medium">
                    Contact
                  </Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
