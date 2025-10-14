"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import { api } from "@/lib/api"
import type { User } from "@/types"

const fetchUser = async (id: string) => {
  const res = await api.get(`/users/${id}`)
  return res.data as User
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>()
  const { data: user, isLoading } = useSWR(params?.id ? `user-${params.id}` : null, () => fetchUser(params.id))

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-8 text-muted-foreground">Loading profile...</div>
  if (!user) return <div className="mx-auto max-w-4xl px-4 py-8 text-muted-foreground">User not found.</div>

  const rating = user.rating ?? 5
  const skills = user.skills?.length ? user.skills.join(", ") : "Various skills"
  const bio = user.bio || "No bio provided yet."
  const portfolio = Array.isArray(user.portfolio) ? user.portfolio : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-4">
        <img
          alt={user.name}
          src={user.avatar || "/placeholder-user.jpg"}
          className="h-16 w-16 rounded-full border object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <div className="text-sm text-muted-foreground">⭐ {rating}</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-medium">About</h2>
        <p className="text-muted-foreground mt-2">{bio}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium">Skills</h2>
        <p className="text-muted-foreground mt-2">{skills}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium">Portfolio</h2>
        {Array.isArray(portfolio) && portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {portfolio.map((item: any, idx: number) => {
              const title = typeof item === "string" ? item : item.title
              const url = typeof item === "string" ? item : item.url
              const thumb =
                typeof item === "string"
                  ? "/creative-portfolio-layout.png"
                  : item.thumbnail || "/creative-portfolio-layout.png"
              return (
                <a
                  key={`${title}-${idx}`}
                  className="rounded-md border p-3 hover:bg-muted"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img alt={title} src={thumb || "/placeholder.svg"} className="w-full h-28 object-cover rounded" />
                  <div className="mt-2 text-sm font-medium line-clamp-1">{title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{url}</div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="text-muted-foreground mt-2">No portfolio items yet.</div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-medium">Contact</h2>
        <div className="text-sm mt-2 space-y-1">
          <div>
            <span className="font-medium">Email: </span>
            <a className="text-primary underline" href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </div>
          <div>
            <span className="font-medium">Phone: </span>
            <a className="text-primary underline" href={`tel:${user.phone || ""}`}>
              {user.phone || "N/A"}
            </a>
          </div>
          <div>
            <span className="font-medium">Chat: </span>
            <a className="text-primary underline" href={user.chatUrl || "/auth/signin"}>
              {user.chatUrl ? "Open chat" : "Start chat (sign in)"}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
