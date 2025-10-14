"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/api"
import type { Service } from "@/types"

const CATEGORIES: { key: string; label: string }[] = [
  { key: "development", label: "Web Development" },
  { key: "media", label: "Media Creation" },
  { key: "seo", label: "SEO" },
  { key: "design", label: "Graphic Design" },
  { key: "video", label: "Video Editing" },
  { key: "writing", label: "Content Writing" },
  { key: "marketing", label: "Marketing" },
  { key: "ai", label: "AI Services" },
  { key: "apps", label: "App Development" },
]

async function fetchAutocomplete(_: string, q: string) {
  if (!q) return { items: [] as Service[] }
  const res = await api.get("/services", { params: { query: q, page: 1, pageSize: 5 } })
  const payload: any = res?.data
  const items: Service[] = Array.isArray(payload) ? payload : (payload?.items ?? [])
  return { items }
}

export function SearchBar() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce the query to limit requests while typing
  const [debouncedQ, setDebouncedQ] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 200)
    return () => clearTimeout(t)
  }, [q])

  const { data, isLoading } = useSWR(q ? ["autocomplete", debouncedQ] : null, fetchAutocomplete)
  const services = data?.items ?? []

  const categoryMatches = useMemo(() => {
    if (!debouncedQ) return []
    const k = debouncedQ.toLowerCase()
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(k)).slice(0, 5)
  }, [debouncedQ])

  // Merge suggestions: prioritize services first, then categories, limit 5
  const suggestions = useMemo(() => {
    const svc = services.slice(0, 5)
    const remaining = Math.max(0, 5 - svc.length)
    const cats = categoryMatches.slice(0, remaining)
    return { svc, cats }
  }, [services, categoryMatches])

  useEffect(() => {
    if (q) setOpen(true)
    else setOpen(false)
  }, [q])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.get("/services", { params: { query: q } })
    } catch {}
    router.push(`/explore?query=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            aria-label="Search for services"
            placeholder="Try “logo design”, “seo”, “react app”..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => q && setOpen(true)}
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Spinner className="h-4 w-4" />
            </div>
          )}
        </div>
        <Button type="submit" aria-label="Search">
          Search
        </Button>
      </form>

      {open && (suggestions.svc.length > 0 || suggestions.cats.length > 0) && (
        <div role="listbox" className="absolute z-40 mt-2 w-full rounded-md border bg-background shadow-sm">
          <ul className="py-2">
            {suggestions.svc.map((s) => (
              <li key={`svc-${s.id}`}>
                <Link
                  role="option"
                  href={`/services/${s.id}`}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="line-clamp-1">{s.title}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{s.category}</span>
                </Link>
              </li>
            ))}
            {suggestions.cats.map((c) => (
              <li key={`cat-${c.key}`}>
                <Link
                  role="option"
                  href={`/explore/${encodeURIComponent(c.key)}`}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="line-clamp-1">{c.label}</span>
                  <span className="ml-3 text-xs text-muted-foreground">Category</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
