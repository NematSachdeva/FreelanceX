"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api, authHeader } from "@/lib/api"

export default function BecomeSellerPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await api.post("/sellers", { name: displayName, bio }, { headers: { ...authHeader() } })
      setSuccess("Seller profile created!")
      router.push("/dashboard/seller")
    } catch (e) {
      setError("You must be signed in to become a seller.")
      router.push("/auth/signin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Become a Seller</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Display Name</label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio</label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows={5} />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Profile"}
        </Button>
      </form>
    </div>
  )
}
