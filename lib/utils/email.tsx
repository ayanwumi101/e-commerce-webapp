// /**
//  * Email utility using Resend
//  *
//  * To get your Resend API key:
//  * 1. Go to https://resend.com and sign up (free tier: 3000 emails/month)
//  * 2. Go to API Keys section in dashboard
//  * 3. Create a new API key
//  * 4. Add RESEND_API_KEY to your environment variables
//  *
//  * For the EMAIL_FROM variable:
//  * - Use "onboarding@resend.dev" for testing (works immediately)
//  * - Or add & verify your own domain in Resend dashboard
//  */

// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev"
// const OWNER_EMAIL = process.env.OWNER_EMAIL || "ayanwumi101@gmail.com"

// interface OrderEmailData {
//   orderId: string
//   customerName: string
//   customerEmail: string
//   items: Array<{
//     title: string
//     qty: number
//     price: number
//     size?: string
//   }>
//   subtotal: number
//   deliveryFee: number
//   total: number
//   shippingAddress: string
//   reference: string
// }

// /**
//  * Generate order confirmation HTML email
//  */
// function generateOrderEmailHtml(data: OrderEmailData): string {
//   const itemRows = data.items
//     .map(
//       (item) => `
//       <tr>
//         <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
//           ${item.title}${item.size ? ` (Size: ${item.size})` : ""}
//         </td>
//         <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
//           ${item.qty}
//         </td>
//         <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
//           ₦${item.price.toLocaleString()}
//         </td>
//       </tr>
//     `,
//     )
//     .join("")

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Order Confirmation</title>
//     </head>
//     <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
//       <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
//         <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 32px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Order Confirmed!</h1>
//             <p style="color: #d1d5db; margin: 8px 0 0 0; font-size: 14px;">Thank you for your purchase</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 32px;">
//             <p style="margin: 0 0 16px 0;">Hi ${data.customerName},</p>
//             <p style="margin: 0 0 24px 0;">Your order has been confirmed and is being processed. Here are your order details:</p>
            
//             <!-- Order Info -->
//             <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
//               <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>
//               <p style="margin: 0;"><strong>Reference:</strong> ${data.reference}</p>
//             </div>
            
//             <!-- Items Table -->
//             <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
//               <thead>
//                 <tr style="background: #f3f4f6;">
//                   <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
//                   <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
//                   <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${itemRows}
//               </tbody>
//             </table>
            
//             <!-- Totals -->
//             <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
//               <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                 <span style="color: #6b7280;">Subtotal:</span>
//                 <span>₦${data.subtotal.toLocaleString()}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                 <span style="color: #6b7280;">Delivery Fee:</span>
//                 <span>₦${data.deliveryFee.toLocaleString()}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
//                 <span>Total:</span>
//                 <span style="color: #059669;">₦${data.total.toLocaleString()}</span>
//               </div>
//             </div>
            
//             <!-- Shipping Address -->
//             <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
//               <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #374151;">Shipping Address</h3>
//               <p style="margin: 0; color: #6b7280;">${data.shippingAddress}</p>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="padding: 24px 32px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
//             <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Need help? Contact us at support@sneakerwears.com</p>
//             <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} SneakerWears. All rights reserved.</p>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//   `
// }

// /**
//  * Send order confirmation email to customer
//  */
// export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
//   try {
//     const { error } = await resend.emails.send({
//       from: EMAIL_FROM,
//       to: data.customerEmail,
//       subject: `Order Confirmed - ${data.orderId}`,
//       html: generateOrderEmailHtml(data),
//     })

//     if (error) {
//       console.error("Failed to send customer email:", error)
//       return false
//     }

//     return true
//   } catch (error) {
//     console.error("Email send error:", error)
//     return false
//   }
// }

// /**
//  * Send order notification to shop owner
//  */
// export async function sendOwnerNotificationEmail(data: OrderEmailData): Promise<boolean> {
//   try {
//     const { error } = await resend.emails.send({
//       from: EMAIL_FROM,
//       to: OWNER_EMAIL,
//       subject: `New Order Received - ${data.orderId}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//         </head>
//         <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
//           <h1 style="color: #059669;">New Order Received!</h1>
//           <p><strong>Order ID:</strong> ${data.orderId}</p>
//           <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
//           <p><strong>Total:</strong> ₦${data.total.toLocaleString()}</p>
//           <p><strong>Reference:</strong> ${data.reference}</p>
          
//           <h3>Items:</h3>
//           <ul>
//             ${data.items.map((item) => `<li>${item.title} x${item.qty} - ₦${item.price.toLocaleString()}</li>`).join("")}
//           </ul>
          
//           <h3>Shipping Address:</h3>
//           <p>${data.shippingAddress}</p>
          
//           <hr>
//           <p style="color: #6b7280; font-size: 12px;">This is an automated notification from SneakerWears.</p>
//         </body>
//         </html>
//       `,
//     })

//     if (error) {
//       console.error("Failed to send owner notification:", error)
//       return false
//     }

//     return true
//   } catch (error) {
//     console.error("Owner notification error:", error)
//     return false
//   }
// }

// /**
//  * Send both customer and owner emails
//  */
// export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
//   await Promise.all([sendOrderConfirmationEmail(data), sendOwnerNotificationEmail(data)])
// }




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
 *
 * IMPORTANT - Resend Testing Limitations:
 * ========================================
 * When using "onboarding@resend.dev" (test sender):
 * - You can ONLY send emails to the email address registered with your Resend account
 * - This means OWNER_EMAIL must be your Resend account email for owner notifications to work
 * - Customer emails will only work during testing if the customer uses the same email
 *
 * For Production:
 * ===============
 * 1. Purchase a custom domain (e.g., roftan-collections.com)
 * 2. Add & verify the domain at https://resend.com/domains
 * 3. Update EMAIL_FROM to use your verified domain email (e.g., "orders@yourdomain.com")
 * 4. Then you can send to ANY email address
 *
 * Note: You CANNOT verify Netlify subdomains (roftan-colections.netlify.app)
 * because you don't own the parent domain (netlify.app)
 */

import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = process.env.OWNER_EMAIL

// In production, set EMAIL_FROM to your verified domain email (e.g., "orders@yourdomain.com")
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev"

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

interface OrderItem {
  title: string
  qty: number
  price: number
  size?: string | null
  images?: string[]
}

interface OrderEmailData {
  id: string
  reference: string
  subtotal: number
  deliveryFee: number
  total: number
  items: OrderItem[]
}

/**
 * Generate order confirmation HTML email for customer
 */
function generateCustomerEmailHtml(order: OrderEmailData, customerName: string, shippingAddress: string): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500;">${item.title}</div>
          ${item.size ? `<div style="font-size: 13px; color: #6b7280;">Size: ${item.size}</div>` : ""}
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">
          ${item.qty}
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
          ₦${Number(item.price).toLocaleString()}
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 32px; text-align: center;">
            <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px;">✓</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
            <p style="color: #d1d5db; margin: 12px 0 0 0; font-size: 15px;">Thank you for shopping with us</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 16px;">Hi <strong>${customerName}</strong>,</p>
            <p style="margin: 0 0 28px 0; color: #4b5563;">Your order has been confirmed and is being processed. We'll notify you when it ships!</p>
            
            <!-- Order Info Card -->
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 12px; padding: 20px; margin-bottom: 28px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0;">
                    <span style="color: #6b7280; font-size: 14px;">Order ID</span>
                  </td>
                  <td style="padding: 4px 0; text-align: right;">
                    <span style="font-family: 'SF Mono', Monaco, monospace; font-size: 14px; font-weight: 600; color: #1f2937;">${order.id.slice(0, 12)}...</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">
                    <span style="color: #6b7280; font-size: 14px;">Reference</span>
                  </td>
                  <td style="padding: 4px 0; text-align: right;">
                    <span style="font-family: 'SF Mono', Monaco, monospace; font-size: 14px; font-weight: 600; color: #1f2937;">${order.reference}</span>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Items Table -->
            <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #374151;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 14px 16px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
                  <th style="padding: 14px 16px; text-align: center; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                  <th style="padding: 14px 16px; text-align: right; font-weight: 600; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right;">₦${Number(order.subtotal).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Delivery Fee</td>
                  <td style="padding: 8px 0; text-align: right;">₦${Number(order.deliveryFee).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 12px;">
                    <div style="border-top: 1px solid #e5e7eb;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: 700;">Total</td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #059669;">₦${Number(order.total).toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <!-- Shipping Address -->
            <div style="margin-top: 28px; padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center;">
                <span style="margin-right: 8px;">📍</span> Shipping Address
              </h3>
              <p style="margin: 0; color: #4b5563; line-height: 1.5;">${shippingAddress}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 28px 32px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #4b5563;">Questions about your order?</p>
            <a href="mailto:support@sneakerwears.com" style="color: #1f2937; font-weight: 500; text-decoration: none;">support@sneakerwears.com</a>
            <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} SneakerWears. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate owner notification HTML email
 */
function generateOwnerEmailHtml(
  order: OrderEmailData,
  customerName: string,
  customerEmail: string,
  shippingAddress: string,
): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.title}</strong>
          ${item.size ? `<br><span style="font-size: 13px; color: #6b7280;">Size: ${item.size}</span>` : ""}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.qty}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">₦${Number(item.price).toLocaleString()}</td>
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
      <title>New Order Notification</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px; text-align: center;">
            <!-- Fixed icon centering using table-based layout for email client compatibility -->
            <table role="presentation" style="margin: 0 auto 12px auto;">
              <tr>
                <td style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 28px; line-height: 56px;">🛒</span>
                </td>
              </tr>
            </table>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Order Received!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 15px;">A customer just placed an order</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <!-- Order Amount Highlight -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; margin-bottom: 28px; text-align: center; border: 1px solid #a7f3d0;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #047857; font-weight: 500;">Order Total</p>
              <p style="margin: 0; font-size: 36px; font-weight: 700; color: #059669;">₦${Number(
                order.total
              ).toLocaleString()}</p>
            </div>

            <!-- Customer Info -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #374151;">
                <span style="margin-right: 8px;">👤</span> Customer Details
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; width: 100px;">Name</td>
                  <td style="padding: 6px 0; font-weight: 500;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Email</td>
                  <td style="padding: 6px 0;">
                    <a href="mailto:${customerEmail}" style="color: #1f2937; text-decoration: none;">${customerEmail}</a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Order Info -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #374151;">
                <span style="margin-right: 8px;">📦</span> Order Information
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; width: 100px;">Order ID</td>
                  <td style="padding: 6px 0; font-family: 'SF Mono', Monaco, monospace; font-size: 13px;">${
                    order.id
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Reference</td>
                  <td style="padding: 6px 0; font-family: 'SF Mono', Monaco, monospace; font-size: 13px;">${
                    order.reference
                  }</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #374151;">
              <span style="margin-right: 8px;">🛍️</span> Items Ordered (${
                order.items.length
              })
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f9fafb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #e5e7eb;">
                  <th style="padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px;">Item</th>
                  <th style="padding: 12px 16px; text-align: center; font-weight: 600; font-size: 13px;">Qty</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 13px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Totals -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right;">₦${Number(
                    order.subtotal
                  ).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Delivery Fee</td>
                  <td style="padding: 6px 0; text-align: right;">₦${Number(
                    order.deliveryFee
                  ).toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <!-- Shipping Address -->
            <div style="background: #fef3c7; border-radius: 12px; padding: 20px; border: 1px solid #fcd34d;">
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                <span style="margin-right: 8px;">📍</span> Shipping Address
              </h3>
              <p style="margin: 0; color: #78350f; line-height: 1.6;">${shippingAddress}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 24px 32px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">This is an automated notification from SneakerWears</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  order: OrderEmailData,
  customerName: string,
  shippingAddress: string,
): Promise<boolean> {
  if (!resend) {
    console.error("Cannot send customer email - Resend not configured (missing RESEND_API_KEY)")
    return false
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: customerEmail,
      subject: `Order Confirmed - ${order.reference}`,
      html: generateCustomerEmailHtml(order, customerName, shippingAddress),
    })

    if (error) {
      console.error("Failed to send customer email:", error)
      return false
    }

    console.log("Customer confirmation email sent successfully. ID:", data?.id)
    return true
  } catch (error) {
    console.error("Customer email send error:", error)
    return false
  }
}

/**
 * Send order notification to shop owner
 */
export async function sendOwnerNotificationEmail(
  order: OrderEmailData,
  customerName: string,
  customerEmail: string,
  shippingAddress: string,
): Promise<boolean> {
  if (!resend) {
    console.error("Cannot send owner email - Resend not configured (missing RESEND_API_KEY)")
    return false
  }

  if (!OWNER_EMAIL) {
    console.error("Cannot send owner email - OWNER_EMAIL not configured")
    return false
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: OWNER_EMAIL,
      subject: `🛒 New Order - ₦${Number(order.total).toLocaleString()} from ${customerName}`,
      html: generateOwnerEmailHtml(order, customerName, customerEmail, shippingAddress),
    })

    if (error) {
      console.error("Failed to send owner notification:", error)
      return false
    }

    console.log("Owner notification email sent successfully. ID:", data?.id)
    return true
  } catch (error) {
    console.error("Owner notification error:", error)
    return false
  }
}

/**
 * Send both customer and owner emails with delay to avoid rate limiting
 */
export async function sendOrderEmails(
  customerEmail: string,
  order: OrderEmailData,
  customerName: string,
  shippingAddress: string,
): Promise<void> {
  // Send owner email first (more likely to work with test sender)
  const ownerResult = await sendOwnerNotificationEmail(order, customerName, customerEmail, shippingAddress)
  console.log("Owner email result:", ownerResult)

  // Wait 1.5 seconds before sending customer email to avoid rate limit
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const customerResult = await sendOrderConfirmationEmail(customerEmail, order, customerName, shippingAddress)
  console.log("Customer email result:", customerResult)
}
