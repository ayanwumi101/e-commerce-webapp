"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Package, ChevronRight, Loader2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/animations/motion-wrapper"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending Payment",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (status !== "authenticated") return

      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        if (data.success) {
          setOrders(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [status])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Sign in to view your orders</h1>
          <p className="mt-2 text-muted-foreground">You need to be signed in to view your order history.</p>
          <Button asChild className="mt-6">
            <Link href="/auth/signin?callbackUrl=/orders">Sign In</Link>
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Orders</h1>
          <p className="mt-1 text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">When you make a purchase, your orders will appear here.</p>
            <Button asChild className="mt-6">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">Order #{order.reference || order.id.slice(0, 8)}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <Badge className={statusColors[order.status as OrderStatus]}>
                        {statusLabels[order.status as OrderStatus]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items Preview */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item: any) => (
                        <div
                          key={item.id}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary"
                        >
                          <Image
                            src={item.images?.[0] || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          {item.qty > 1 && (
                            <span className="absolute bottom-0 right-0 rounded-tl-lg bg-background px-1.5 py-0.5 text-xs font-medium">
                              x{item.qty}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-muted-foreground">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Items:</span>{" "}
                          <span className="font-medium">
                            {order.items.reduce((sum: number, item: any) => sum + item.qty, 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>{" "}
                          <span className="font-semibold">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
