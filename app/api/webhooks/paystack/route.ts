import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyWebhookSignature } from "@/lib/utils/paystack"
import { sendOrderConfirmationEmail, sendOwnerNotificationEmail } from "@/lib/utils/email"
import { buildAddressString } from "@/lib/utils/geocode"

// POST /api/webhooks/paystack - Handle Paystack webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature") || ""

    // Verify webhook signature
    if (process.env.PAYSTACK_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(body, signature)
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(body)

    // Handle charge.success event
    if (event.event === "charge.success") {
      const { reference, status } = event.data

      if (status === "success") {
        // Get order by reference
        const orders = await sql`
          SELECT * FROM "Order" WHERE reference = ${reference} LIMIT 1
        `

        const order = orders[0]

        if (order && !order.paid) {
          // Update order status
          await sql`
            UPDATE "Order"
            SET paid = true, status = 'PAID', "updatedAt" = NOW()
            WHERE id = ${order.id}
          `

          // Clear user's cart
          await sql`
            DELETE FROM "CartItem" WHERE "userId" = ${order.userId}
          `

          // Get order items and user info for email
          const orderItems = await sql`
            SELECT * FROM "OrderItem" WHERE "orderId" = ${order.id}
          `

          const users = await sql`
            SELECT name, email FROM "User" WHERE id = ${order.userId} LIMIT 1
          `
          const user = users[0]

          const addresses = await sql`
            SELECT street, city, region, country FROM "Address"
            WHERE id = ${order.shippingAddrId}
            LIMIT 1
          `
          const address = addresses[0]
          const shippingAddress = address
            ? buildAddressString(address.street, address.city, address.region, address.country)
            : "N/A"

          // Send confirmation emails
          const fullOrder = { ...order, items: orderItems }
          await sendOrderConfirmationEmail(user.email, fullOrder, user.name, shippingAddress)
          await sendOwnerNotificationEmail(fullOrder, user.name, user.email, shippingAddress)
        }
      }
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ success: false, error: "Webhook processing failed" }, { status: 500 })
  }
}
