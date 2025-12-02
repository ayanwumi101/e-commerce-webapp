import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET /api/orders/[id] - Get order details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get order (admin can view any order, user can only view their own)
    let orders
    if (session.user.isAdmin) {
      orders = await sql`
        SELECT 
          o.*,
          u.name as "userName",
          u.email as "userEmail",
          u.phone as "userPhone"
        FROM "Order" o
        JOIN "User" u ON o."userId" = u.id
        WHERE o.id = ${id}
        LIMIT 1
      `
    } else {
      orders = await sql`
        SELECT * FROM "Order"
        WHERE id = ${id} AND "userId" = ${session.user.id}
        LIMIT 1
      `
    }

    const order = orders[0]

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const items = await sql`
      SELECT 
        oi.*,
        p.images,
        p.slug
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      WHERE oi."orderId" = ${id}
    `

    // Get shipping address
    let shippingAddress = null
    if (order.shippingAddrId) {
      const addresses = await sql`
        SELECT * FROM "Address" WHERE id = ${order.shippingAddrId} LIMIT 1
      `
      shippingAddress = addresses[0]
    }

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        shippingAddress,
      },
    })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
