import { z } from "zod"

// User signup validation schema
export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  country: z.string().default("Nigeria"),
})

export type SignupInput = z.infer<typeof signupSchema>

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

// Product validation schema (for admin)
export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  discount: z.number().min(0).max(100).optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  category: z.enum(["sneakers", "men", "women"]),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  featured: z.boolean().default(false),
})

export type ProductInput = z.infer<typeof productSchema>

// Cart item validation
export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  size: z.string().optional(),
  qty: z.number().int().positive().default(1),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>

// Update cart item validation
export const updateCartSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  qty: z.number().int().min(0),
})

export type UpdateCartInput = z.infer<typeof updateCartSchema>

// Address validation schema
export const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  country: z.string().default("Nigeria"),
  postalCode: z.string().optional(),
})

export type AddressInput = z.infer<typeof addressSchema>

// Checkout validation
export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Shipping address is required"),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

// Profile update validation
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Order status update validation (admin)
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
