export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  isSeller?: boolean
  rating?: number
  skills?: string[]
  bio?: string
  phone?: string
  chatUrl?: string
  portfolio?: { title: string; url: string; thumbnail?: string }[] | string[]
  // Optional profile fields for profiles page
  location?: string
  experience?: number
  education?: string
}

export type Service = {
  id: string
  title: string
  description?: string
  thumbnail?: string
  price: number
  rating?: number
  seller?: Pick<User, "id" | "name" | "avatar">
  category?: string
  tags?: string[]
}

export type Order = {
  id: string
  serviceId: string
  service?: Pick<Service, "title" | "thumbnail" | "price">
  userId?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  createdAt?: string
}
