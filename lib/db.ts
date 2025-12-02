import { neon } from "@neondatabase/serverless"

// Create a reusable SQL client for Neon
export const sql = neon(process.env.DATABASE_URL!)

// Helper to generate unique IDs
export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}
