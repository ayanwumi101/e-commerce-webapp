import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET /api/orders - Get user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // If admin, get all orders; otherwise, get only user's orders
    let orders
    if (session.user.isAdmin) {
      orders = await sql`
        SELECT 
          o.*,
          u.name as "userName",
          u.email as "userEmail"
        FROM "Order" o
        JOIN "User" u ON o."userId" = u.id
        ORDER BY o."createdAt" DESC
      `
    } else {
      orders = await sql`
        SELECT * FROM "Order"
        WHERE "userId" = ${session.user.id}
        ORDER BY "createdAt" DESC
      `
    }

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await sql`
          SELECT 
            oi.*,
            p.images,
            p.slug
          FROM "OrderItem" oi
          JOIN "Product" p ON oi."productId" = p.id
          WHERE oi."orderId" = ${order.id}
        `
        return { ...order, items }
      }),
    )

    return NextResponse.json({
      success: true,
      data: ordersWithItems,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
