"use client"

import type React from "react"

import { createContext, useContext, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { CartItem, CartContextType } from "@/lib/types"

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (status !== "authenticated") {
      setItems([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/cart")
      const data = await res.json()
      if (data.success) {
        setItems(data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = async (productId: string, size?: string, qty = 1) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size, qty }),
    })
    const data = await res.json()
    if (data.success) {
      await fetchCart()
    } else {
      throw new Error(data.error)
    }
  }

  const updateItem = async (itemId: string, qty: number) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, qty }),
    })
    const data = await res.json()
    if (data.success) {
      await fetchCart()
    } else {
      throw new Error(data.error)
    }
  }

  const removeItem = async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) {
      await fetchCart()
    } else {
      throw new Error(data.error)
    }
  }

  const clearCart = async () => {
    for (const item of items) {
      await removeItem(item.id)
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = items.reduce((sum, item) => {
    const price = (item as any).discountedPrice || (item as any).price || 0
    return sum + price * item.qty
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
