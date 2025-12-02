import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { productSchema } from "@/lib/validations"

// GET /api/products/[id] - Get product by ID or slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    const products = await sql`
      SELECT *
      FROM "Product"
      WHERE id = ${id} OR slug = ${id}
      LIMIT 1
    `

    const product = products[0]

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validationResult = productSchema.partial().safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const data = validationResult.data

    await sql`
      UPDATE "Product"
      SET
        title = COALESCE(${data.title || null}, title),
        description = COALESCE(${data.description || null}, description),
        price = COALESCE(${data.price || null}, price),
        discount = COALESCE(${data.discount || null}, discount),
        images = COALESCE(${data.images || null}, images),
        category = COALESCE(${data.category || null}, category),
        sizes = COALESCE(${data.sizes || null}, sizes),
        stock = COALESCE(${data.stock ?? null}, stock),
        featured = COALESCE(${data.featured ?? null}, featured),
        "updatedAt" = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const { id } = await params

    await sql`DELETE FROM "Product" WHERE id = ${id}`

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
