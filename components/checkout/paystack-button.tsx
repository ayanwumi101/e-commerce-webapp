"use client"

import { useState } from "react"
import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

interface PaystackButtonProps {
  email: string
  amount: number // in kobo
  reference: string
  orderId: string
  onSuccess?: () => void
  onClose?: () => void
}

export function PaystackButton({ email, amount, reference, orderId, onSuccess, onClose }: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { clearCart } = useCart()

  const config = {
    reference,
    email,
    amount, // amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    currency: "NGN",
  }

  const handleSuccess = async (response: { reference: string }) => {
    setIsLoading(true)
    try {
      // Verify payment on server
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: response.reference,
          orderId,
        }),
      })

      if (res.ok) {
        clearCart()
        onSuccess?.()
        router.push(`/checkout/success?orderId=${orderId}`)
      } else {
        throw new Error("Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      alert("Payment verification failed. Please contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose?.()
  }

  const initializePayment = usePaystackPayment(config)

  const handleClick = () => {
    initializePayment({
      onSuccess: handleSuccess,
      onClose: handleClose,
    })
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Now
        </>
      )}
    </Button>
  )
}
