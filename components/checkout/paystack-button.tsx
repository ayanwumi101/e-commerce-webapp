// "use client"

// import { useState } from "react"
// import { usePaystackPayment } from "react-paystack"
// import { Button } from "@/components/ui/button"
// import { Loader2, CreditCard } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useCart } from "@/contexts/cart-context"

// interface PaystackButtonProps {
//   email: string
//   amount: number // in kobo
//   reference: string
//   orderId: string
//   onSuccess?: () => void
//   onClose?: () => void
// }

// export function PaystackButton({ email, amount, reference, orderId, onSuccess, onClose }: PaystackButtonProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const { clearCart } = useCart()

//   const config = {
//     reference,
//     email,
//     amount, // amount in kobo
//     publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
//     currency: "NGN",
//   }

//   const handleSuccess = async (response: { reference: string }) => {
//     setIsLoading(true)
//     try {
//       // Verify payment on server
//       const res = await fetch("/api/checkout/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           reference: response.reference,
//           orderId,
//         }),
//       })

//       if (res.ok) {
//         clearCart()
//         onSuccess?.()
//         router.push(`/checkout/success?orderId=${orderId}`)
//       } else {
//         throw new Error("Payment verification failed")
//       }
//     } catch (error) {
//       console.error("Payment verification error:", error)
//       alert("Payment verification failed. Please contact support.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleClose = () => {
//     onClose?.()
//   }

//   const initializePayment = usePaystackPayment(config)

//   const handleClick = () => {
//     initializePayment({
//       onSuccess: handleSuccess,
//       onClose: handleClose,
//     })
//   }

//   return (
//     <Button onClick={handleClick} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700" size="lg">
//       {isLoading ? (
//         <>
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           Verifying Payment...
//         </>
//       ) : (
//         <>
//           <CreditCard className="mr-2 h-4 w-4" />
//           Pay Now
//         </>
//       )}
//     </Button>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackButtonProps {
  email: string;
  amount: number; // in kobo
  reference: string;
  orderId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function PaystackButton({
  email,
  amount,
  reference,
  orderId,
  onSuccess,
  onClose,
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else if (window.PaystackPop) {
      setIsScriptLoaded(true);
    }
  }, []);

  const handleSuccess = async (response: { reference: string }) => {
    setIsLoading(true);
    try {
      // Verify payment on server
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: response.reference,
          orderId,
        }),
      });

      if (res.ok) {
        clearCart();
        onSuccess?.();
        router.push(`/checkout/success?orderId=${orderId}`);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleClick = () => {
    if (!isScriptLoaded || !window.PaystackPop) {
      alert("Payment system is loading. Please try again.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      email,
      amount,
      currency: "NGN",
      ref: reference,
      onClose: handleClose,
      callback: handleSuccess,
    });

    handler.openIframe();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || !isScriptLoaded}
      className="w-full bg-green-600 hover:bg-green-700"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying Payment...
        </>
      ) : !isScriptLoaded ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Now
        </>
      )}
    </Button>
  );
}
