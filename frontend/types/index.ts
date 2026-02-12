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
  freelancer?: Pick<User, "id" | "name" | "avatar"> // For Android compatibility
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

export type Order = {
  id: string
  serviceId: string
  service?: Pick<Service, "title" | "thumbnail" | "price">
  userId?: string
  client?: Pick<User, "id" | "name" | "email" | "avatar">
  freelancer?: Pick<User, "id" | "name" | "email" | "avatar">
  status: "pending" | "in-progress" | "completed" | "cancelled"
  price?: number
  requirements?: string
  rating?: number
  review?: string
  messages?: Array<{
    id: string
    senderId: string
    message: string
    createdAt: string
  }>
  createdAt: string
  updatedAt?: string
}
