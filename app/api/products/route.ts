import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql, generateId } from "@/lib/db"
import { productSchema } from "@/lib/validations"

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const size = searchParams.get("size")
    const sort = searchParams.get("sort") || "newest"
    const featured = searchParams.get("featured")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "12")

    // Build query conditions
    let query = sql`
      SELECT *, COUNT(*) OVER() as total_count
      FROM "Product"
      WHERE 1=1
    `

    // Apply filters
    if (category && category !== "all") {
      query = sql`${query} AND category = ${category}`
    }

    if (priceMin) {
      query = sql`${query} AND price >= ${Number.parseFloat(priceMin)}`
    }

    if (priceMax) {
      query = sql`${query} AND price <= ${Number.parseFloat(priceMax)}`
    }

    if (size) {
      query = sql`${query} AND ${size} = ANY(sizes)`
    }

    if (featured === "true") {
      query = sql`${query} AND featured = true`
    }

    // Apply sorting
    switch (sort) {
      case "price_asc":
        query = sql`${query} ORDER BY price ASC`
        break
      case "price_desc":
        query = sql`${query} ORDER BY price DESC`
        break
      case "oldest":
        query = sql`${query} ORDER BY "createdAt" ASC`
        break
      case "newest":
      default:
        query = sql`${query} ORDER BY "createdAt" DESC`
        break
    }

    // Apply pagination
    const offset = (page - 1) * pageSize
    query = sql`${query} LIMIT ${pageSize} OFFSET ${offset}`

    const products = await query

    const totalCount = products[0]?.total_count || 0

    // Remove total_count from products
    const cleanProducts = products.map(({ total_count, ...product }) => product)

    return NextResponse.json({
      success: true,
      data: cleanProducts,
      total: Number.parseInt(totalCount),
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = productSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const data = validationResult.data
    const id = generateId("prod")
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check for duplicate slug
    const existing = await sql`
      SELECT id FROM "Product" WHERE slug = ${slug} LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "A product with a similar name already exists" },
        { status: 409 },
      )
    }

    await sql`
      INSERT INTO "Product" (
        id, title, slug, description, price, discount,
        images, category, sizes, stock, featured,
        "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${data.title}, ${slug}, ${data.description},
        ${data.price}, ${data.discount || null},
        ${data.images}, ${data.category}, ${data.sizes},
        ${data.stock}, ${data.featured},
        NOW(), NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: { id, slug },
    })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
