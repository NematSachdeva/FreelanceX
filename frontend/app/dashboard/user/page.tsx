"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { api, authHeader } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Order } from "@/types"

const fetchOrders = async () => {
  const res = await api.get("/orders", { headers: { ...authHeader() } })
  return (res.data?.items ?? []) as Order[]
}

export default function UserDashboardPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const { data } = useSWR(authed ? "my-orders" : null, fetchOrders)

  useEffect(() => {
    if (!getToken()) {
      router.replace("/auth/signin")
    } else {
      setAuthed(true)
    }
  }, [router])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>
      {!data?.length ? (
        <div className="text-muted-foreground">No orders yet. Hire a freelancer to get started.</div>
      ) : (
        <ul className="space-y-3">
          {data.map((o) => (
            <li key={o.id} className="rounded-lg border p-4">
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-muted-foreground">Service: {o.service?.title ?? o.serviceId}</div>
              <div className="text-sm text-muted-foreground">Status: {o.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
