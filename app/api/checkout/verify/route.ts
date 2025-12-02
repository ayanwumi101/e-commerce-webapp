import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { verifyPayment } from "@/lib/utils/paystack"
import { sendOrderConfirmationEmail, sendOwnerNotificationEmail } from "@/lib/utils/email"
import { buildAddressString } from "@/lib/utils/geocode"

// POST /api/checkout/verify - Verify payment and complete order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ success: false, error: "Payment reference is required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paymentResult = await verifyPayment(reference)

    if (paymentResult.data.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }

    // Get order
    const orders = await sql`
      SELECT * FROM "Order"
      WHERE reference = ${reference} AND "userId" = ${session.user.id}
      LIMIT 1
    `

    const order = orders[0]

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    if (order.paid) {
      return NextResponse.json({
        success: true,
        message: "Order already paid",
        data: { orderId: order.id },
      })
    }

    // Update order status
    await sql`
      UPDATE "Order"
      SET paid = true, status = 'PAID', "updatedAt" = NOW()
      WHERE id = ${order.id}
    `

    // Clear user's cart
    await sql`
      DELETE FROM "CartItem" WHERE "userId" = ${session.user.id}
    `

    // Get order items for email
    const orderItems = await sql`
      SELECT * FROM "OrderItem" WHERE "orderId" = ${order.id}
    `

    // Get user and address info for email
    const users = await sql`
      SELECT name, email FROM "User" WHERE id = ${session.user.id} LIMIT 1
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

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order.id,
        status: "PAID",
      },
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}
