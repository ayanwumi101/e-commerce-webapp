"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/animations/motion-wrapper"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import type { Address } from "@/lib/types"

const DELIVERY_FEE = 1500

export default function CartPage() {
  const { data: session, status } = useSession()
  const { items, subtotal, itemCount, updateItem, removeItem, isLoading: cartLoading } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Fetch user addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (status !== "authenticated") return

      try {
        const res = await fetch("/api/addresses")
        const data = await res.json()
        if (data.success) {
          setAddresses(data.data)
          const defaultAddr = data.data.find((a: Address) => a.isDefault)
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id)
          } else if (data.data.length > 0) {
            setSelectedAddressId(data.data[0].id)
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error)
      }
    }

    fetchAddresses()
  }, [status])

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    try {
      await updateItem(itemId, newQty)
    } catch (error) {
      toast.error("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address")
      return
    }

    setIsCheckingOut(true)
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url
    } catch (error) {
      toast.error("Checkout failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
      setIsCheckingOut(false)
    }
  }

  if (status === "loading" || cartLoading) {
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
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Sign in to view your cart</h1>
          <p className="mt-2 text-muted-foreground">You need to be signed in to add items to your cart.</p>
          <Button asChild className="mt-6">
            <Link href="/auth/signin?callbackUrl=/cart">Sign In</Link>
          </Button>
        </div>
      </PageTransition>
    )
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageTransition>
    )
  }

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/products">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="mt-1 text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y divide-border p-0">
                <AnimatePresence>
                  {items.map((item: any) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 p-4 sm:p-6"
                    >
                      {/* Image */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-32 sm:w-32">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg?height=128&width=128&query=product"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-semibold text-foreground hover:text-accent"
                            >
                              {item.title}
                            </Link>
                            {item.size && <p className="mt-1 text-sm text-muted-foreground">Size: {item.size}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          {/* Quantity */}
                          <div className="flex items-center rounded-lg border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                              disabled={item.qty >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {formatCurrency(item.discountedPrice * item.qty)}
                            </p>
                            {item.discount && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatCurrency(item.price * item.qty)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Delivery Address */}
                <div>
                  <label className="text-sm font-medium text-foreground">Delivery Address</label>
                  {addresses.length > 0 ? (
                    <select
                      value={selectedAddressId || ""}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label || "Address"} - {addr.street}, {addr.city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No addresses found.{" "}
                      <Link href="/profile" className="text-accent hover:underline">
                        Add one
                      </Link>
                    </p>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-foreground">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !selectedAddressId || items.length === 0}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Payment Info */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secure payment powered by Paystack. We accept cards, bank transfers, and USSD.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
