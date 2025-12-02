"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils/format"
import { Package, ShoppingCart, Users, TrendingUp, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-600",
  PAID: "bg-blue-500/20 text-blue-600",
  SHIPPED: "bg-purple-500/20 text-purple-600",
  DELIVERED: "bg-green-500/20 text-green-600",
  CANCELLED: "bg-red-500/20 text-red-600",
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [selectedTab, setSelectedTab] = useState("orders")

  // Fetch all orders (admin endpoint would return all orders)
  const { data: orders, mutate: mutateOrders } = useSWR(session?.user ? "/api/orders?all=true" : null, fetcher)

  const { data: products } = useSWR("/api/products", fetcher)

  // Redirect if not admin
  useEffect(() => {
    if (status === "authenticated" && !(session?.user as { isAdmin?: boolean })?.isAdmin) {
      redirect("/")
    }
  }, [session, status])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      mutateOrders()
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  // Calculate stats
  const stats = {
    totalOrders: orders?.length || 0,
    totalRevenue:
      orders?.reduce((sum: number, o: { total: number; paid: boolean }) => sum + (o.paid ? o.total : 0), 0) || 0,
    pendingOrders: orders?.filter((o: { status: string }) => o.status === "PENDING").length || 0,
    totalProducts: products?.products?.length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store orders and products</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {!orders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(
                        (order: {
                          id: string
                          reference: string
                          user: { name: string; email: string }
                          total: number
                          status: string
                          paid: boolean
                          createdAt: string
                          items: Array<{ id: string; title: string; qty: number }>
                        }) => (
                          <div
                            key={order.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">Order #{order.reference || order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.user.name} ({order.user.email})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} items - {formatPrice(order.total)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <Badge className={statusColors[order.status]}>{order.status}</Badge>
                              <Badge variant={order.paid ? "default" : "outline"}>
                                {order.paid ? "Paid" : "Unpaid"}
                              </Badge>

                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusUpdate(order.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="PAID">Paid</SelectItem>
                                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Products</CardTitle>
                  <Button>Add Product</Button>
                </CardHeader>
                <CardContent>
                  {!products?.products ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.products.map(
                        (product: {
                          id: string
                          title: string
                          price: number
                          stock: number
                          category: string
                          featured: boolean
                        }) => (
                          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium">{product.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.category} - Stock: {product.stock}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">{formatPrice(product.price)}</span>
                              {product.featured && <Badge>Featured</Badge>}
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
