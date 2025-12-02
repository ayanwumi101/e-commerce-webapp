"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface Product {
  id: string
  title: string
  slug: string
  price: number
  discount?: number
  images: string[]
  category: string
}

interface ProductCarouselProps {
  products: Product[]
  autoPlay?: boolean
  interval?: number
}

export function ProductCarousel({ products, autoPlay = true, interval = 5000 }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }, [products.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }, [products.length])

  useEffect(() => {
    if (!autoPlay || products.length <= 1) return

    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, nextSlide, products.length])

  if (products.length === 0) {
    return null
  }

  const currentProduct = products[currentIndex]
  const discountedPrice = currentProduct.discount
    ? currentProduct.price * (1 - currentProduct.discount / 100)
    : currentProduct.price

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 aspect-square">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Link href={`/products/${currentProduct.slug}`}>
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <Image
                    src={currentProduct.images[0] || "/placeholder.svg?height=500&width=500&query=sneaker"}
                    alt={currentProduct.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {currentProduct.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{currentProduct.discount}%
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {currentProduct.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">{currentProduct.title}</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{formatCurrency(discountedPrice)}</span>
                {currentProduct.discount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(currentProduct.price)}
                  </span>
                )}
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link href={`/products/${currentProduct.slug}`}>View Details</Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/80 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
