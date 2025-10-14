import Link from "next/link"
import type { Service } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function labelFromCategory(c?: string) {
  if (!c) return "General"
  return c
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

export function ServiceCard({ service }: { service: Service }) {
  const category = labelFromCategory(service.category)
  const desc =
    service.description ||
    "High-quality freelance service tailored to your needs. Fast turnaround and great communication."

  return (
    <Card className="h-full hover:shadow-sm transition hover:-translate-y-0.5">
      <CardContent className="p-0">
        <Link href={`/services/${service.id}`} className="block">
          <img
            alt={service.title}
            src={service.thumbnail || "/placeholder.svg?height=180&width=320&query=service%20thumbnail"}
            className="w-full h-44 object-cover rounded-t-lg"
          />
        </Link>
        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground">{category}</div>
          <Link href={`/services/${service.id}`} className="block font-medium line-clamp-2 hover:underline">
            {service.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{desc}</p>
          <div className="text-sm text-muted-foreground">
            {service.seller?.name ?? "Seller"} • ⭐ {service.rating ?? 5} • From ${service.price}
          </div>
          <div className="pt-1">
            <Button asChild size="sm" variant="outline" aria-label="View Details">
              <Link href={`/services/${service.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
