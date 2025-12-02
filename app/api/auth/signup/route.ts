import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql, generateId } from "@/lib/db"
import { signupSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { email, password, name, phone, street, city, region, country } = validationResult.data

    // Check if user exists
    const existingUsers = await sql`
      SELECT id FROM "User" WHERE email = ${email} LIMIT 1
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate IDs
    const userId = generateId("user")
    const addressId = generateId("addr")

    // Create user
    await sql`
      INSERT INTO "User" (id, email, password, name, phone, "createdAt", "updatedAt")
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, ${phone || null}, NOW(), NOW())
    `

    await sql`
      INSERT INTO "Address" (id, "userId", label, street, city, region, country, "isDefault", "createdAt")
      VALUES (
        ${addressId},
        ${userId},
        'Home',
        ${street},
        ${city},
        ${region || null},
        ${country},
        true,
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: { userId },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 })
  }
}
