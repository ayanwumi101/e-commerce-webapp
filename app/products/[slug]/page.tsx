"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart, Share2, Minus, Plus, ChevronLeft, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product/product-card"
import { AuthModal } from "@/components/auth/auth-modal"
import { PageTransition, SlideUp } from "@/components/animations/motion-wrapper"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        const data = await res.json()

        if (data.success) {
          setProduct(data.data)
          setSelectedSize(data.data.sizes[0] || null)

          // Fetch related products
          const relatedRes = await fetch(`/api/products?category=${data.data.category}&pageSize=4`)
          const relatedData = await relatedRes.json()
          if (relatedData.success) {
            setRelatedProducts(relatedData.data.filter((p: Product) => p.id !== data.data.id).slice(0, 4))
          }
        } else {
          router.push("/products")
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        router.push("/products")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug, router])

  const handleAddToCart = async () => {
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!product || !selectedSize) return

    setIsAddingToCart(true)
    try {
      await addItem(product.id, selectedSize, quantity)
      toast.success("Added to cart", {
        description: `${product.title} (Size ${selectedSize}) x${quantity}`,
      })
    } catch (error) {
      toast.error("Failed to add to cart", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-secondary"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600&query=product"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.discount && (
                <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                  -{product.discount}% OFF
                </Badge>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index ? "border-accent" : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <SlideUp>
              <div className="mb-4">
                <p className="text-sm font-medium uppercase tracking-wider text-accent">{product.category}</p>
                <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{product.title}</h1>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{formatCurrency(discountedPrice)}</span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                )}
              </div>
            </SlideUp>

            <SlideUp delay={0.15}>
              <p className="mb-6 text-muted-foreground leading-relaxed">{product.description}</p>
            </SlideUp>

            <Separator className="my-6" />

            {/* Size Selection */}
            <SlideUp delay={0.2}>
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium">Select Size</Label>
                  <button className="text-sm text-accent hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </SlideUp>

            {/* Quantity */}
            <SlideUp delay={0.25}>
              <div className="mb-6">
                <Label className="mb-3 block text-sm font-medium">Quantity</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} available</span>
                </div>
              </div>
            </SlideUp>

            {/* Actions */}
            <SlideUp delay={0.3}>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAddingToCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="lg" className="px-4 bg-transparent">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
                <Button variant="outline" size="lg" className="px-4 bg-transparent">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </SlideUp>

            {/* Features */}
            <SlideUp delay={0.35}>
              <div className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">2-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Authentic</p>
                    <p className="text-xs text-muted-foreground">100% genuine</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <RefreshCw className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">7-day policy</p>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-foreground">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </PageTransition>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
