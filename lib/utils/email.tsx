/**
 * Email utility using Resend
 *
 * To get your Resend API key:
 * 1. Go to https://resend.com and sign up (free tier: 3000 emails/month)
 * 2. Go to API Keys section in dashboard
 * 3. Create a new API key
 * 4. Add RESEND_API_KEY to your environment variables
 *
 * For the EMAIL_FROM variable:
 * - Use "onboarding@resend.dev" for testing (works immediately)
 * - Or add & verify your own domain in Resend dashboard
 */

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev"
const OWNER_EMAIL = process.env.OWNER_EMAIL || "ayanwumi101@gmail.com"

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    title: string
    qty: number
    price: number
    size?: string
  }>
  subtotal: number
  deliveryFee: number
  total: number
  shippingAddress: string
  reference: string
}

/**
 * Generate order confirmation HTML email
 */
function generateOrderEmailHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.title}${item.size ? ` (Size: ${item.size})` : ""}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.qty}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ₦${item.price.toLocaleString()}
        </td>
      </tr>
    `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Order Confirmed!</h1>
            <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 14px;">Thank you for your purchase</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="margin: 0 0 16px 0;">Hi ${data.customerName},</p>
            <p style="margin: 0 0 24px 0;">Your order has been confirmed and is being processed. Here are your order details:</p>
            
            <!-- Order Info -->
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>
              <p style="margin: 0;"><strong>Reference:</strong> ${data.reference}</p>
            </div>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span>₦${data.subtotal.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Delivery Fee:</span>
                <span>₦${data.deliveryFee.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <span>Total:</span>
                <span style="color: #059669;">₦${data.total.toLocaleString()}</span>
              </div>
            </div>
            
            <!-- Shipping Address -->
            <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #374151;">Shipping Address</h3>
              <p style="margin: 0; color: #6b7280;">${data.shippingAddress}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 24px 32px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Need help? Contact us at support@sneakerwears.com</p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} SneakerWears. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `Order Confirmed - ${data.orderId}`,
      html: generateOrderEmailHtml(data),
    })

    if (error) {
      console.error("Failed to send customer email:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Email send error:", error)
    return false
  }
}

/**
 * Send order notification to shop owner
 */
export async function sendOwnerNotificationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: OWNER_EMAIL,
      subject: `New Order Received - ${data.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
          <h1 style="color: #059669;">New Order Received!</h1>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Total:</strong> ₦${data.total.toLocaleString()}</p>
          <p><strong>Reference:</strong> ${data.reference}</p>
          
          <h3>Items:</h3>
          <ul>
            ${data.items.map((item) => `<li>${item.title} x${item.qty} - ₦${item.price.toLocaleString()}</li>`).join("")}
          </ul>
          
          <h3>Shipping Address:</h3>
          <p>${data.shippingAddress}</p>
          
          <hr>
          <p style="color: #6b7280; font-size: 12px;">This is an automated notification from SneakerWears.</p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Failed to send owner notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Owner notification error:", error)
    return false
  }
}

/**
 * Send both customer and owner emails
 */
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  await Promise.all([sendOrderConfirmationEmail(data), sendOwnerNotificationEmail(data)])
}
