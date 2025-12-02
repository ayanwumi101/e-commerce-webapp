"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/cart-context"
import { ReducedMotionProvider } from "@/hooks/use-reduced-motion"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReducedMotionProvider>
        <CartProvider>{children}</CartProvider>
      </ReducedMotionProvider>
    </SessionProvider>
  )
}
