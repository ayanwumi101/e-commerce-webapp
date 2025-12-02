"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"
import { useScrollReveal, useParallax } from "@/hooks/use-scroll-reveal"
import { SlideUp, FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper"
import type { Product } from "@/lib/types"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Hero carousel slides
const heroSlides = [
  {
    title: "Step Into Style",
    subtitle: "New Collection 2025",
    description: "Discover premium sneakers that define your unique style.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
    cta: "Shop Sneakers",
    href: "/products?category=sneakers",
  },
  {
    title: "Elevate Your Look",
    subtitle: "Men's Fashion",
    description: "Premium clothing for the modern gentleman.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200",
    cta: "Shop Men",
    href: "/products?category=men",
  },
  {
    title: "Effortless Elegance",
    subtitle: "Women's Collection",
    description: "Curated styles for every occasion.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    cta: "Shop Women",
    href: "/products?category=women",
  },
]

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery across Nigeria with real-time tracking.",
  },
  {
    icon: Shield,
    title: "100% Authentic",
    description: "All products are genuine and sourced from authorized dealers.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy on all orders.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Handpicked products that meet our quality standards.",
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const heroRef = useParallax<HTMLDivElement>(0.3)
  const aboutRef = useScrollReveal<HTMLDivElement>({ y: 50, stagger: 0.1 })
  const featuresRef = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.15 })
  const productsRef = useScrollReveal<HTMLDivElement>({ y: 40 })

  // Fetch featured products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?featured=true&pageSize=6")
        const data = await res.json()
        if (data.success) {
          setFeaturedProducts(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchProducts()
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div ref={heroRef} className="absolute inset-0 -z-10">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentSlide === index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {heroSlides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 30,
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={currentSlide === index ? "block" : "hidden"}
              >
                <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
                  {slide.subtitle}
                </span>
                <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
                  {slide.title}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground text-pretty">{slide.description}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href={slide.href}>
                      {slide.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full bg-transparent">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentSlide(index)
                }}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full bg-transparent">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-secondary/30 py-16">
        <div ref={featuresRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-background">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section ref={productsRef} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <SlideUp>
                <span className="text-sm font-medium uppercase tracking-wider text-accent">Featured Collection</span>
              </SlideUp>
              <SlideUp delay={0.1}>
                <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Trending Now</h2>
              </SlideUp>
            </div>
            <SlideUp delay={0.2}>
              <Button asChild variant="outline">
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SlideUp>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.length > 0
              ? featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              : // Skeleton loading
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
                ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-accent">About Us</span>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl text-balance">Your Trusted Fashion Destination</h2>
              <p className="mt-6 text-primary-foreground/80 leading-relaxed">
                At Sneakers & Wears, we believe that fashion is more than just clothing—it&apos;s a form of
                self-expression. Founded with a passion for authentic streetwear and premium fashion, we&apos;ve grown
                to become Nigeria&apos;s go-to destination for sneaker enthusiasts and fashion-forward individuals.
              </p>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Every product in our collection is carefully curated to ensure authenticity, quality, and style. We
                partner directly with authorized distributors to bring you the latest releases and timeless classics.
              </p>
              <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
                  alt="Sneakers collection"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-accent p-6 text-accent-foreground shadow-xl">
                <p className="text-4xl font-bold">5K+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeIn>
              <span className="text-sm font-medium uppercase tracking-wider text-accent">Why Choose Us</span>
            </FadeIn>
            <SlideUp delay={0.1}>
              <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">The Sneakers & Wears Difference</h2>
            </SlideUp>
          </div>

          <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-3" staggerDelay={0.15}>
            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-card-foreground">Authenticity Guaranteed</h3>
                <p className="mt-3 text-muted-foreground">
                  Every product comes with a certificate of authenticity. We source directly from authorized retailers
                  and brands.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Truck className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-card-foreground">Nationwide Delivery</h3>
                <p className="mt-3 text-muted-foreground">
                  Fast and reliable delivery to all 36 states in Nigeria. Track your order in real-time from dispatch to
                  doorstep.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-card-foreground">Premium Selection</h3>
                <p className="mt-3 text-muted-foreground">
                  Curated collection of the finest sneakers and fashion wear from top global brands and emerging
                  designers.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 animated-gradient opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SlideUp>
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Ready to Upgrade Your Style?
            </h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
              Join thousands of satisfied customers who trust Sneakers & Wears for their fashion needs. Start shopping
              today and experience the difference.
            </p>
          </SlideUp>
          <SlideUp delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </section>
    </div>
  )
}
