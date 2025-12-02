import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql, generateId } from "@/lib/db"
import { addressSchema } from "@/lib/validations"

// GET /api/addresses - Get user's addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await sql`
      SELECT * FROM "Address"
      WHERE "userId" = ${session.user.id}
      ORDER BY "isDefault" DESC, "createdAt" DESC
    `

    return NextResponse.json({
      success: true,
      data: addresses,
    })
  } catch (error) {
    console.error("Get addresses error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch addresses" }, { status: 500 })
  }
}

// POST /api/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = addressSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { label, street, city, region, country, postalCode } = validationResult.data
    const id = generateId("addr")

    await sql`
      INSERT INTO "Address" (
        id, "userId", label, street, city, region, country,
        "postalCode", "isDefault", "createdAt"
      )
      VALUES (
        ${id}, ${session.user.id}, ${label || null}, ${street}, ${city},
        ${region || null}, ${country}, ${postalCode || null},
        false, NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      data: { id },
    })
  } catch (error) {
    console.error("Add address error:", error)
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 })
  }
}
