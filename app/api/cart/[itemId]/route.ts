import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    await sql`
      DELETE FROM "CartItem"
      WHERE id = ${itemId} AND "userId" = ${session.user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Delete cart item error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove item from cart" }, { status: 500 })
  }
}
