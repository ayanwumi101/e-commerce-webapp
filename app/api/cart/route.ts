import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql, generateId } from "@/lib/db"
import { addToCartSchema, updateCartSchema } from "@/lib/validations"

// GET /api/cart - Get current user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const cartItems = await sql`
      SELECT 
        ci.id,
        ci."productId",
        ci.size,
        ci.qty,
        ci."createdAt",
        p.title,
        p.slug,
        p.price,
        p.discount,
        p.images,
        p.stock,
        p.currency
      FROM "CartItem" ci
      JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."userId" = ${session.user.id}
      ORDER BY ci."createdAt" DESC
    `

    // Calculate totals
    const items = cartItems.map((item) => {
      const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price
      return {
        ...item,
        discountedPrice,
        itemTotal: discountedPrice * item.qty,
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0)
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

    return NextResponse.json({
      success: true,
      data: {
        items,
        subtotal,
        itemCount,
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = addToCartSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { productId, size, qty } = validationResult.data

    // Check if product exists and has stock
    const products = await sql`
      SELECT id, stock, sizes FROM "Product" WHERE id = ${productId} LIMIT 1
    `

    const product = products[0]

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    if (product.stock < qty) {
      return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 })
    }

    // Check if size is valid
    if (size && !product.sizes.includes(size)) {
      return NextResponse.json({ success: false, error: "Invalid size selected" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingItems = await sql`
      SELECT id, qty FROM "CartItem"
      WHERE "userId" = ${session.user.id}
        AND "productId" = ${productId}
        AND (size = ${size || null} OR (size IS NULL AND ${size || null} IS NULL))
      LIMIT 1
    `

    if (existingItems.length > 0) {
      // Update existing item quantity
      const newQty = existingItems[0].qty + qty
      await sql`
        UPDATE "CartItem"
        SET qty = ${newQty}
        WHERE id = ${existingItems[0].id}
      `
    } else {
      // Add new item
      const id = generateId("cart")
      await sql`
        INSERT INTO "CartItem" (id, "userId", "productId", size, qty, "createdAt")
        VALUES (${id}, ${session.user.id}, ${productId}, ${size || null}, ${qty}, NOW())
      `
    }

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to add item to cart" }, { status: 500 })
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = updateCartSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { itemId, qty } = validationResult.data

    if (qty === 0) {
      // Remove item
      await sql`
        DELETE FROM "CartItem"
        WHERE id = ${itemId} AND "userId" = ${session.user.id}
      `
    } else {
      // Update quantity
      await sql`
        UPDATE "CartItem"
        SET qty = ${qty}
        WHERE id = ${itemId} AND "userId" = ${session.user.id}
      `
    }

    return NextResponse.json({
      success: true,
      message: qty === 0 ? "Item removed from cart" : "Cart updated",
    })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}
