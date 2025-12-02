"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ChevronLeft, Package, Truck, MapPin, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/motion-wrapper"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

const statusConfig: Record<OrderStatus, { color: string; icon: typeof Package; label: string }> = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending Payment" },
  PAID: { color: "bg-blue-100 text-blue-800", icon: CheckCircle2, label: "Paid" },
  SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Delivered" },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { status: authStatus } = useSession()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (authStatus !== "authenticated") return

      try {
        const res = await fetch(`/api/orders/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setOrder(data.data)
        } else {
          router.push("/orders")
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        router.push("/orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, authStatus, router])

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!order) return null

  const statusInfo = statusConfig[order.status as OrderStatus]
  const StatusIcon = statusInfo.icon

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/orders">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Order #{order.reference || order.id.slice(0, 8)}</h1>
              <p className="mt-1 text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <Badge className={`${statusInfo.color} gap-1.5 px-3 py-1.5`}>
              <StatusIcon className="h-4 w-4" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {order.items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.images?.[0] || "/placeholder.svg?height=80&width=80&query=product"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link href={`/products/${item.slug}`} className="font-medium text-foreground hover:text-accent">
                        {item.title}
                      </Link>
                      {item.size && <span className="text-sm text-muted-foreground">Size: {item.size}</span>}
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
                        <span className="font-semibold">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}
                    {order.shippingAddress.region && `, ${order.shippingAddress.region}`}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Reference */}
            {order.reference && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reference:</span>
                    <br />
                    <span className="font-mono">{order.reference}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
