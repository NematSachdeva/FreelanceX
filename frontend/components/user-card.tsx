import Link from "next/link"
import type { User } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

export function UserCard({ user }: { user: User }) {
  const rating = user.rating ?? 5
  const skills = user.skills?.slice(0, 3)?.join(", ") || "Various skills"
  return (
    <Link href={`/users/${user.id}`} className="block focus:outline-none">
      <Card className="h-full hover:shadow-sm transition">
        <CardContent className="p-4 flex items-center gap-3">
          <img
            alt={user.name}
            src={user.avatar || "/placeholder-user.jpg"}
            className="h-12 w-12 rounded-full border object-cover"
          />
          <div className="min-w-0">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {"⭐ "}
              {rating} {" • "} {skills}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
