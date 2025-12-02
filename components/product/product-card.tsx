"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ShoppingBag, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { cn, formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const handleAddToCart = async () => {
    if (!session) {
      setShowAuthModal(true)
      return
    }

    setIsLoading(true)
    try {
      await addItem(product.id, product.sizes[0])
      toast.success("Added to cart", {
        description: `${product.title} has been added to your cart.`,
      })
    } catch (error) {
      toast.error("Failed to add to cart", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn("group relative overflow-hidden rounded-2xl glass-card", className)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=400&query=sneaker"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Discount Badge */}
          {product.discount && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">-{product.discount}%</Badge>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute right-3 top-3 flex flex-col gap-2"
          >
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/80 to-transparent p-4"
          >
            <div className="flex w-full gap-2">
              <Button asChild variant="secondary" className="flex-1">
                <Link href={`/products/${product.slug}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
              <Button onClick={handleAddToCart} disabled={isLoading || product.stock === 0} className="flex-1">
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
              <h3 className="mt-1 font-semibold leading-tight text-foreground line-clamp-1">
                <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors">
                  {product.title}
                </Link>
              </h3>
            </div>
          </div>

          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">{formatCurrency(discountedPrice)}</span>
              {product.discount && (
                <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
