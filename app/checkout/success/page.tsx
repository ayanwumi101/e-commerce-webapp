// "use client"

// import { useEffect, useState, Suspense } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { CheckCircle2, Package, ArrowRight, Loader2, XCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { PageTransition } from "@/components/animations/motion-wrapper"

// function CheckoutSuccessContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const reference = searchParams.get("reference")

//   const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
//   const [orderData, setOrderData] = useState<any>(null)

//   useEffect(() => {
//     async function verifyPayment() {
//       if (!reference) {
//         setStatus("error")
//         return
//       }

//       try {
//         const res = await fetch("/api/checkout/verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ reference }),
//         })

//         const data = await res.json()

//         if (data.success) {
//           setStatus("success")
//           setOrderData(data.data)
//         } else {
//           setStatus("error")
//         }
//       } catch (error) {
//         setStatus("error")
//       }
//     }

//     verifyPayment()
//   }, [reference])

//   if (status === "loading") {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
//           <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
//           <p className="text-muted-foreground">Please wait while we confirm your order.</p>
//         </div>
//       </div>
//     )
//   }

//   if (status === "error") {
//     return (
//       <PageTransition>
//         <div className="mx-auto max-w-lg px-4 py-16 text-center">
//           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
//             <XCircle className="mx-auto h-20 w-20 text-destructive" />
//           </motion.div>
//           <h1 className="mt-6 text-2xl font-bold">Payment Verification Failed</h1>
//           <p className="mt-2 text-muted-foreground">
//             We couldn&apos;t verify your payment. If you were charged, please contact support.
//           </p>
//           <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
//             <Button asChild>
//               <Link href="/cart">Return to Cart</Link>
//             </Button>
//             <Button variant="outline" asChild>
//               <Link href="/contact">Contact Support</Link>
//             </Button>
//           </div>
//         </div>
//       </PageTransition>
//     )
//   }

//   return (
//     <PageTransition>
//       <div className="mx-auto max-w-lg px-4 py-16">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", duration: 0.5 }}
//           className="text-center"
//         >
//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
//             <CheckCircle2 className="h-12 w-12 text-green-600" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mt-6 text-center"
//         >
//           <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
//           <p className="mt-2 text-muted-foreground">Thank you for your order. A confirmation email has been sent.</p>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//           <Card className="mt-8">
//             <CardHeader className="pb-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Order ID</span>
//                 <span className="font-mono text-sm font-medium">{orderData?.orderId?.slice(0, 12)}...</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Reference</span>
//                 <span className="font-mono text-sm font-medium">{reference}</span>
//               </div>
//             </CardHeader>
//             <CardContent className="border-t pt-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
//                   <Package className="h-6 w-6 text-accent" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Order is being processed</p>
//                   <p className="text-sm text-muted-foreground">Estimated delivery: 2-5 business days</p>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col gap-3 border-t pt-4">
//               <Button asChild className="w-full gap-2">
//                 <Link href="/orders">
//                   View Order Details
//                   <ArrowRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//               <Button variant="outline" asChild className="w-full bg-transparent">
//                 <Link href="/products">Continue Shopping</Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </div>
//     </PageTransition>
//   )
// }

// export default function CheckoutSuccessPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-[60vh] items-center justify-center">
//           <Loader2 className="h-12 w-12 animate-spin text-accent" />
//         </div>
//       }
//     >
//       <CheckoutSuccessContent />
//     </Suspense>
//   )
// }


"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PageTransition } from "@/components/animations/motion-wrapper";
import { useCart } from "@/contexts/cart-context";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const { refreshCart } = useCart();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setOrderData(data.data);
          await refreshCart();
          setTimeout(() => {
            router.push("/orders");
          }, 5000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    }

    verifyPayment();
  }, [reference, router, refreshCart]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
          <p className="mt-4 text-lg font-medium">Verifying your payment...</p>
          <p className="text-muted-foreground">
            Please wait while we confirm your order.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <PageTransition>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <XCircle className="mx-auto h-20 w-20 text-destructive" />
          </motion.div>
          <h1 className="mt-6 text-2xl font-bold">
            Payment Verification Failed
          </h1>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t verify your payment. If you were charged, please
            contact support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/cart">Return to Cart</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-lg px-4 py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Payment Successful!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. A confirmation email has been sent.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You will be redirected to your orders in a few seconds...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm font-medium">
                  {orderData?.orderId?.slice(0, 12)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reference</span>
                <span className="font-mono text-sm font-medium">
                  {reference}
                </span>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Order is being processed</p>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: 2-5 business days
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-4">
              <Button asChild className="w-full gap-2">
                <Link href="/orders">
                  View Your Orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full bg-transparent"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
