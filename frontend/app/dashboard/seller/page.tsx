"use client"

import type React from "react"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { api, authHeader } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Service } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const fetcher = async () => {
  const res = await api.get("/services", { headers: { ...authHeader() }, params: { mine: 1 } })
  return res.data as { items: Service[] }
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const { data, mutate } = useSWR(authed ? "seller-services" : null, fetcher)

  useEffect(() => {
    if (!getToken()) {
      router.replace("/auth/signin")
    } else {
      setAuthed(true)
    }
  }, [router])

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number>(50)
  const [description, setDescription] = useState("")

  const createService = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post("/services", { title, price, description }, { headers: { ...authHeader() } })
    setTitle("")
    setPrice(50)
    setDescription("")
    mutate()
  }

  const remove = async (id: string) => {
    await api.delete(`/services/${id}`, { headers: { ...authHeader() } })
    mutate()
  }

  const edit = async (id: string) => {
    await api.put(`/services/${id}`, { title: `${Date.now()} - Updated` }, { headers: { ...authHeader() } })
    mutate()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Seller Dashboard</h1>

      <form onSubmit={createService} className="rounded-lg border p-4 grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Price (USD)</label>
          <Input type="number" min={5} value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm mb-1">Description</label>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Button type="submit">Add Service</Button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-medium mb-3">Your Services</h2>
        {!data?.items?.length ? (
          <div className="text-muted-foreground">No services yet. Create your first service above.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.items.map((svc) => (
              <li key={svc.id} className="rounded-lg border p-4">
                <div className="font-medium">{svc.title}</div>
                <div className="text-sm text-muted-foreground">${svc.price}</div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" onClick={() => edit(svc.id)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => remove(svc.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
