import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { updateProfileSchema } from "@/lib/validations"

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const users = await sql`
      SELECT id, email, name, phone, avatar, "isAdmin", "createdAt"
      FROM "User"
      WHERE id = ${session.user.id}
      LIMIT 1
    `

    const user = users[0]

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get user addresses
    const addresses = await sql`
      SELECT id, label, street, city, region, country, "postalCode", lat, lon, "isDefault"
      FROM "Address"
      WHERE "userId" = ${session.user.id}
      ORDER BY "isDefault" DESC, "createdAt" DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        addresses,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user profile" }, { status: 500 })
  }
}

// PUT /api/users/me - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { name, phone, avatar } = validationResult.data

    // Build update query dynamically
    const updates: string[] = []
    const values: (string | null)[] = []

    if (name !== undefined) {
      updates.push("name")
      values.push(name)
    }
    if (phone !== undefined) {
      updates.push("phone")
      values.push(phone || null)
    }
    if (avatar !== undefined) {
      updates.push("avatar")
      values.push(avatar || null)
    }

    if (updates.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No changes made",
      })
    }

    // Update user
    await sql`
      UPDATE "User"
      SET
        name = COALESCE(${name || null}, name),
        phone = COALESCE(${phone || null}, phone),
        avatar = COALESCE(${avatar || null}, avatar),
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
