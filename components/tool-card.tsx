import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  iconColor?: string
  gradientClass?: string
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor = "text-white",
  gradientClass = "gradient-primary",
}: ToolCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer bg-card border-2 hover:border-primary/20 group">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
          <div
            className={`p-4 rounded-xl ${gradientClass} shadow-lg group-hover:shadow-xl transition-all duration-300`}
          >
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
