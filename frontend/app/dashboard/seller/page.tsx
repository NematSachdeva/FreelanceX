"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { getToken } from "@/lib/auth"
import type { Service, Order } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, DollarSign, Package, Star, TrendingUp, Users } from "lucide-react"

const servicesFetcher = async () => {
  const res = await api.get("/services?mine=1")
  return res.data as { items: Service[] }
}

const ordersFetcher = async () => {
  const res = await api.get("/orders/freelancer")
  return res.data as { orders: Order[] }
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const { data: servicesData, mutate: mutateServices } = useSWR(authed ? "seller-services" : null, servicesFetcher)
  const { data: ordersData, mutate: mutateOrders } = useSWR(authed ? "freelancer-orders" : null, ordersFetcher)

  useEffect(() => {
    if (!getToken()) {
      router.replace("/auth/signin")
    } else {
      setAuthed(true)
    }
  }, [router])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      mutateOrders()
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const removeService = async (id: string) => {
    try {
      await api.delete(`/services/${id}`)
      mutateServices()
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  // Calculate stats
  const services = servicesData?.items || []
  const orders = ordersData?.orders || []
  const activeOrders = orders.filter(order => ['pending', 'in-progress'].includes(order.status))
  const completedOrders = orders.filter(order => order.status === 'completed')
  const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.price || 0), 0)
  const avgRating = completedOrders.length > 0
    ? completedOrders.reduce((sum, order) => sum + (order.rating || 0), 0) / completedOrders.length
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!authed) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Manage your services and track your orders</p>
        </div>
        <Link href="/services/create">
          <Button>Create New Service</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Services available for hire</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">Orders in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">From {completedOrders.length} reviews</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Incoming Orders</TabsTrigger>
          <TabsTrigger value="services">My Services</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Orders</CardTitle>
              <CardDescription>Manage and track your client orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create services to start receiving orders from clients
                  </p>
                  <Link href="/services/create">
                    <Button>Create Your First Service</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{order.service?.title || 'Service'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {order.client?.name || order.client?.email || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">₹{order.price?.toLocaleString()}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {order.requirements && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Requirements:</p>
                          <p className="text-sm text-muted-foreground">{order.requirements}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'in-progress')}
                              >
                                Accept Order
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Decline
                              </Button>
                            </>
                          )}

                          {order.status === 'in-progress' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}

                          <Link href={`/orders/${order.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Services</CardTitle>
              <CardDescription>Manage your service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No services yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first service to start receiving orders
                  </p>
                  <Link href="/services/create">
                    <Button>Create Service</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="mb-3">
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-lg font-semibold text-primary">₹{service.price?.toLocaleString()}</p>
                      </div>

                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                        {service.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {service.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/services/${service.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeService(service.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}