import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { updateOrderStatusSchema } from "@/lib/validations"

// PUT /api/orders/[id]/status - Update order status (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validationResult = updateOrderStatusSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { status } = validationResult.data

    // If cancelling, restore stock
    if (status === "CANCELLED") {
      const orderItems = await sql`
        SELECT "productId", qty FROM "OrderItem" WHERE "orderId" = ${id}
      `

      for (const item of orderItems) {
        await sql`
          UPDATE "Product"
          SET stock = stock + ${item.qty}
          WHERE id = ${item.productId}
        `
      }
    }

    await sql`
      UPDATE "Order"
      SET status = ${status}, "updatedAt" = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Order status updated",
    })
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
  }
}
