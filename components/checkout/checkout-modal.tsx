"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PaystackButton } from "./paystack-button"
import { Loader2, MapPin, Package, Truck } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import { motion, AnimatePresence } from "framer-motion"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: Array<{
    id: string
    product: {
      id: string
      title: string
      price: number
      discount?: number
      images: string[]
    }
    size?: string
    qty: number
  }>
  userEmail: string
  shippingAddress: {
    id: string
    street: string
    city: string
    region?: string
    country: string
  } | null
}

export function CheckoutModal({ isOpen, onClose, cartItems, userEmail, shippingAddress }: CheckoutModalProps) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderData, setOrderData] = useState<{
    orderId: string
    reference: string
    subtotal: number
    deliveryFee: number
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreateOrder = async () => {
    if (!shippingAddress) {
      setError("Please add a shipping address in your profile first")
      return
    }

    setIsCreatingOrder(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddressId: shippingAddress.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      setOrderData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discount ? item.product.price * (1 - item.product.discount / 100) : item.product.price
    return sum + price * item.qty
  }, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Review your order and proceed to payment</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!orderData ? (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Summary
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.title} x{item.qty}
                        {item.size && ` (Size: ${item.size})`}
                      </span>
                      <span>
                        {formatPrice(
                          (item.product.discount
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price) * item.qty,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delivery fee will be calculated based on your address
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                {shippingAddress ? (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p>{shippingAddress.street}</p>
                    <p>
                      {shippingAddress.city}
                      {shippingAddress.region && `, ${shippingAddress.region}`}
                    </p>
                    <p>{shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-sm text-destructive">No shipping address found. Please add one in your profile.</p>
                )}
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}

              <Button onClick={handleCreateOrder} disabled={isCreatingOrder || !shippingAddress} className="w-full">
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Final Order Summary */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(orderData.deliveryFee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(orderData.total)}</span>
                </div>
              </div>

              <PaystackButton
                email={userEmail}
                amount={Math.round(orderData.total * 100)} // Convert to kobo
                reference={orderData.reference}
                orderId={orderData.orderId}
                onClose={() => setOrderData(null)}
              />

              <Button variant="outline" onClick={() => setOrderData(null)} className="w-full">
                Back to Review
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
