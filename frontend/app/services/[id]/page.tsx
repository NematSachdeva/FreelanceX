"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { api, authHeader } from "@/lib/api"
import type { Service, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/modal"
import { useState } from "react"

const fetchService = async (id: string) => {
  const res = await api.get(`/services/${id}`)
  return res.data as Service
}

const fetchUser = async (id: string | undefined) => {
  if (!id) return null
  const res = await api.get(`/users/${id}`)
  return res.data as User
}

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: svc, isLoading } = useSWR(params?.id ? `service-${params.id}` : null, () => fetchService(params.id))
  const { data: seller } = useSWR(svc?.seller?.id ? `user-${svc.seller.id}` : null, () => fetchUser(svc?.seller?.id))
  const [contactOpen, setContactOpen] = useState(false)
  const [message, setMessage] = useState("") // message box state

  const hire = async () => {
    try {
      await api.post("/orders", { serviceId: svc?.id }, { headers: { ...authHeader() } })
      router.push("/dashboard/user")
    } catch (e) {
      router.push("/auth/signin")
    }
  }

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-8 text-muted-foreground">Loading service...</div>
  if (!svc) return <div className="mx-auto max-w-4xl px-4 py-8 text-muted-foreground">Service not found.</div>

  const priceText = `$${svc.price}+`
  const sellerName = svc.seller?.name ?? "Seller"

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <img
            alt={svc.title}
            className="w-full rounded-md border"
            src={svc.thumbnail || "/placeholder.svg?height=360&width=640&query=service%20cover"}
          />
          <h1 className="text-2xl font-semibold mt-4">{svc.title}</h1>
          <p className="text-muted-foreground mt-2">{svc.description}</p>

          {svc.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {svc.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="md:col-span-1 space-y-3">
          <div className="rounded-lg border p-4">
            <div className="text-lg font-medium">Hire this service</div>
            <div className="text-sm text-muted-foreground">Price range</div>
            <div className="text-2xl font-semibold">{priceText}</div>
            <Button className="w-full mt-3" onClick={hire}>
              Hire
            </Button>
            <Button className="w-full mt-2 bg-transparent" variant="outline" onClick={() => setContactOpen(true)}>
              Contact Seller
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-medium">Seller</div>
            <div className="mt-2">{sellerName}</div>
            <div className="text-sm text-muted-foreground">Rating: {svc.rating ?? 5} / 5</div>
            <Button asChild variant="link" className="px-0 h-auto mt-1">
              <a href={`/users/${svc.seller?.id || ""}`}>View Profile</a>
            </Button>
          </div>
        </aside>
      </div>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={`Contact ${sellerName}`}>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-medium">Email</div>
            <a className="text-primary underline" href={`mailto:${seller?.email || "seller@example.com"}`}>
              {seller?.email || "seller@example.com"}
            </a>
          </div>
          <div>
            <div className="font-medium">Phone</div>
            <a className="text-primary underline" href={`tel:${seller?.phone || ""}`}>
              {seller?.phone || "N/A"}
            </a>
          </div>
          <div>
            <div className="font-medium">Chat</div>
            <a
              className="text-primary underline"
              href={seller?.chatUrl || `/auth/signin?returnTo=/chat?user=${encodeURIComponent(svc.seller?.id || "")}`}
            >
              {seller?.chatUrl ? "Open chat" : "Start chat (sign in)"}
            </a>
          </div>

          <div className="pt-1">
            <label htmlFor="message" className="font-medium">
              Send Message
            </label>
            <textarea
              id="message"
              aria-label="Send Message"
              className="mt-1 w-full rounded-md border bg-background p-2 text-sm"
              rows={3}
              placeholder="Write a quick message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="mt-2 flex gap-2">
              <Button
                onClick={() => {
                  // simulate send
                  setMessage("")
                  setContactOpen(false)
                }}
                className="flex-1"
              >
                Send
              </Button>
              <Button variant="outline" onClick={() => setContactOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
