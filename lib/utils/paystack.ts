/**
 * Paystack payment integration utilities
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE_URL = "https://api.paystack.co"

export interface InitializePaymentParams {
  email: string
  amount: number // Amount in kobo (NGN * 100)
  reference: string
  callback_url?: string
  metadata?: Record<string, unknown>
}

export interface PaystackInitResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    channel: string
    customer: {
      email: string
      customer_code: string
    }
    paid_at: string
    created_at: string
  }
}

/**
 * Initialize a Paystack transaction
 */
export async function initializePayment(params: InitializePaymentParams): Promise<PaystackInitResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to initialize payment")
  }

  return response.json()
}

/**
 * Verify a Paystack transaction
 */
export async function verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to verify payment")
  }

  return response.json()
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const crypto = require("crypto")
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET!

  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex")

  return hash === signature
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `SW-${timestamp}-${random}`.toUpperCase()
}
