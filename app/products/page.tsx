"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import { PageTransition } from "@/components/animations/motion-wrapper"
import type { Product } from "@/lib/types"

const categories = [
  { value: "all", label: "All Products" },
  { value: "sneakers", label: "Sneakers" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter state
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== "all") params.set("category", category)
      if (sort) params.set("sort", sort)
      if (priceRange[0] > 0) params.set("priceMin", priceRange[0].toString())
      if (priceRange[1] < 200000) params.set("priceMax", priceRange[1].toString())
      params.set("page", page.toString())
      params.set("pageSize", "12")

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.data)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [category, sort, priceRange, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (category && category !== "all") params.set("category", category)
    if (sort && sort !== "newest") params.set("sort", sort)
    if (page > 1) params.set("page", page.toString())

    const newUrl = params.toString() ? `/products?${params}` : "/products"
    router.replace(newUrl, { scroll: false })
  }, [category, sort, page, router])

  const clearFilters = () => {
    setCategory("all")
    setSort("newest")
    setPriceRange([0, 200000])
    setPage(1)
  }

  const hasActiveFilters = category !== "all" || sort !== "newest" || priceRange[0] > 0 || priceRange[1] < 200000

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {category === "all" ? "All Products" : categories.find((c) => c.value === category)?.label || "Products"}
          </h1>
          <p className="mt-2 text-muted-foreground">Discover our collection of premium sneakers and fashion wear.</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCategory(cat.value)
                setPage(1)
              }}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="mt-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200000}
                        step={5000}
                        className="w-full"
                      />
                      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                        <span>₦{priceRange[0].toLocaleString()}</span>
                        <span>₦{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select value={sort} onValueChange={setSort}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        clearFilters()
                        setIsFilterOpen(false)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Price Filter */}
            <div className="hidden items-center gap-4 lg:flex">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Price:</Label>
                <div className="w-48">
                  <Slider value={priceRange} onValueChange={setPriceRange} max={200000} step={5000} />
                </div>
                <span className="text-sm text-muted-foreground">
                  ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden lg:flex">
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="hidden items-center gap-2 lg:flex">
            <Label className="text-sm text-muted-foreground">Sort:</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Filter className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters or browse all products.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="h-9 w-9"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
