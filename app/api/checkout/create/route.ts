// import { type NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { sql, generateId } from "@/lib/db"
// import { checkoutSchema } from "@/lib/validations"
// import { getDeliveryFee } from "@/lib/utils/delivery"
// import { initializePayment, generatePaymentReference } from "@/lib/utils/paystack"

// // POST /api/checkout/create - Create order and initialize payment
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.id) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const validationResult = checkoutSchema.safeParse(body)

//     if (!validationResult.success) {
//       return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
//     }

//     const { addressId } = validationResult.data

//     // Get user's cart items
//     const cartItems = await sql`
//       SELECT 
//         ci.id,
//         ci."productId",
//         ci.size,
//         ci.qty,
//         p.title,
//         p.price,
//         p.discount,
//         p.stock
//       FROM "CartItem" ci
//       JOIN "Product" p ON ci."productId" = p.id
//       WHERE ci."userId" = ${session.user.id}
//     `

//     if (cartItems.length === 0) {
//       return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 })
//     }

//     // Verify stock availability
//     for (const item of cartItems) {
//       if (item.stock < item.qty) {
//         return NextResponse.json({ success: false, error: `Insufficient stock for ${item.title}` }, { status: 400 })
//       }
//     }

//     // Get shipping address
//     const addresses = await sql`
//       SELECT id, street, city, region, country
//       FROM "Address"
//       WHERE id = ${addressId} AND "userId" = ${session.user.id}
//       LIMIT 1
//     `

//     const address = addresses[0]

//     if (!address) {
//       return NextResponse.json({ success: false, error: "Shipping address not found" }, { status: 404 })
//     }

//     // Calculate subtotal
//     const subtotal = cartItems.reduce((sum, item) => {
//       const price = item.discount ? item.price * (1 - item.discount / 100) : item.price
//       return sum + price * item.qty
//     }, 0)

//     const deliveryFee = getDeliveryFee()

//     const total = subtotal + deliveryFee

//     // Generate order ID and payment reference
//     const orderId = generateId("order")
//     const reference = generatePaymentReference()

//     // Create order
//     await sql`
//       INSERT INTO "Order" (
//         id, "userId", subtotal, "deliveryFee", total, currency,
//         status, paid, reference, "shippingAddrId", "createdAt", "updatedAt"
//       )
//       VALUES (
//         ${orderId}, ${session.user.id}, ${subtotal}, ${deliveryFee}, ${total},
//         'NGN', 'PENDING', false, ${reference}, ${addressId}, NOW(), NOW()
//       )
//     `

//     // Create order items
//     for (const item of cartItems) {
//       const itemId = generateId("oi")
//       const price = item.discount ? item.price * (1 - item.discount / 100) : item.price

//       await sql`
//         INSERT INTO "OrderItem" (id, "orderId", "productId", title, price, qty, size)
//         VALUES (${itemId}, ${orderId}, ${item.productId}, ${item.title}, ${price}, ${item.qty}, ${item.size})
//       `

//       // Reserve stock (reduce available quantity)
//       await sql`
//         UPDATE "Product"
//         SET stock = stock - ${item.qty}
//         WHERE id = ${item.productId}
//       `
//     }

//     // Get user email
//     const users = await sql`
//       SELECT email FROM "User" WHERE id = ${session.user.id} LIMIT 1
//     `
//     const userEmail = users[0]?.email

//     // Initialize Paystack payment
//     const paymentResponse = await initializePayment({
//       email: userEmail,
//       amount: Math.round(total * 100), // Convert to kobo
//       reference,
//       metadata: {
//         orderId,
//         userId: session.user.id,
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       data: {
//         orderId,
//         reference,
//         subtotal,
//         deliveryFee,
//         total,
//         authorization_url: paymentResponse.data.authorization_url,
//         access_code: paymentResponse.data.access_code,
//       },
//     })
//   } catch (error) {
//     console.error("Create checkout error:", error)
//     return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql, generateId } from "@/lib/db"
import { checkoutSchema } from "@/lib/validations"
import { getDeliveryFee } from "@/lib/utils/delivery"
import { initializePayment, generatePaymentReference } from "@/lib/utils/paystack"
import { headers } from "next/headers"

// POST /api/checkout/create - Create order and initialize payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = checkoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { addressId } = validationResult.data

    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = headersList.get("x-forwarded-proto") || "http"
    const baseUrl = `${protocol}://${host}`

    // Get user's cart items
    const cartItems = await sql`
      SELECT 
        ci.id,
        ci."productId",
        ci.size,
        ci.qty,
        p.title,
        p.price,
        p.discount,
        p.stock
      FROM "CartItem" ci
      JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."userId" = ${session.user.id}
    `

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 })
    }

    // Verify stock availability
    for (const item of cartItems) {
      if (item.stock < item.qty) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${item.title}` }, { status: 400 })
      }
    }

    // Get shipping address
    const addresses = await sql`
      SELECT id, street, city, region, country
      FROM "Address"
      WHERE id = ${addressId} AND "userId" = ${session.user.id}
      LIMIT 1
    `

    const address = addresses[0]

    if (!address) {
      return NextResponse.json({ success: false, error: "Shipping address not found" }, { status: 404 })
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price
      return sum + price * item.qty
    }, 0)

    const deliveryFee = getDeliveryFee()

    const total = subtotal + deliveryFee

    // Generate order ID and payment reference
    const orderId = generateId("order")
    const reference = generatePaymentReference()

    // Create order
    await sql`
      INSERT INTO "Order" (
        id, "userId", subtotal, "deliveryFee", total, currency,
        status, paid, reference, "shippingAddrId", "createdAt", "updatedAt"
      )
      VALUES (
        ${orderId}, ${session.user.id}, ${subtotal}, ${deliveryFee}, ${total},
        'NGN', 'PENDING', false, ${reference}, ${addressId}, NOW(), NOW()
      )
    `

    // Create order items
    for (const item of cartItems) {
      const itemId = generateId("oi")
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price

      await sql`
        INSERT INTO "OrderItem" (id, "orderId", "productId", title, price, qty, size)
        VALUES (${itemId}, ${orderId}, ${item.productId}, ${item.title}, ${price}, ${item.qty}, ${item.size})
      `

      // Reserve stock (reduce available quantity)
      await sql`
        UPDATE "Product"
        SET stock = stock - ${item.qty}
        WHERE id = ${item.productId}
      `
    }

    // Get user email
    const users = await sql`
      SELECT email FROM "User" WHERE id = ${session.user.id} LIMIT 1
    `
    const userEmail = users[0]?.email

    const paymentResponse = await initializePayment({
      email: userEmail,
      amount: Math.round(total * 100), // Convert to kobo
      reference,
      callback_url: `${baseUrl}/checkout/success?reference=${reference}`,
      metadata: {
        orderId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        reference,
        subtotal,
        deliveryFee,
        total,
        authorization_url: paymentResponse.data.authorization_url,
        access_code: paymentResponse.data.access_code,
      },
    })
  } catch (error) {
    console.error("Create checkout error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
