"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { getServices } from "@/lib/api"
import type { Service } from "@/types"
import { ServiceCard } from "@/components/service-card"

export default function ExploreCategoryPage() {
  const params = useParams<{ category: string }>()
  const rawCategory = params?.category || ""
  const category = decodeURIComponent(rawCategory)

  const { data: services = [] } = useSWR<Service[]>("services:all", getServices)

  const filtered =
    !category || category.toLowerCase() === "all"
      ? services
      : services.filter((s) => (s.category || "").toLowerCase() === category.toLowerCase())

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">
          {category && category.toLowerCase() !== "all" ? `Explore: ${category}` : "Explore All Services"}
        </h1>
        <Link
          href="/explore"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No services found for this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      )}
    </main>
  )
}
