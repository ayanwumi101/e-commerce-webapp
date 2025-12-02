// Type definitions for the e-commerce application

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface User {
  id: string
  email: string
  password?: string
  name: string
  phone?: string | null
  avatar?: string | null
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  label?: string | null
  street: string
  city: string
  region?: string | null
  country: string
  postalCode?: string | null
  lat?: number | null
  lon?: number | null
  isDefault: boolean
  createdAt: Date
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  discount?: number | null
  currency: string
  images: string[]
  category: string
  sizes: string[]
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  size?: string | null
  qty: number
  createdAt: Date
  product?: Product
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  currency: string
  status: OrderStatus
  paid: boolean
  reference?: string | null
  shippingAddrId?: string | null
  shippingAddr?: Address | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  title: string
  price: number
  qty: number
  size?: string | null
  product?: Product
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Cart context type
export interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isLoading: boolean
  addItem: (productId: string, size?: string, qty?: number) => Promise<void>
  updateItem: (itemId: string, qty: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

// Product filters type
export interface ProductFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  size?: string
  sort?: "price_asc" | "price_desc" | "newest" | "oldest"
  page?: number
  pageSize?: number
  featured?: boolean
}

// Checkout payload
export interface CheckoutPayload {
  addressId: string
}

// Paystack types
export interface PaystackInitResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    currency: string
    customer: {
      email: string
    }
  }
}
