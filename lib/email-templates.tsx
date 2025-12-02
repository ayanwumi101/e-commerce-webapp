import { formatPrice } from "./utils/format"

interface OrderEmailData {
  orderId: string
  reference: string
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
  shippingAddress: {
    street: string
    city: string
    region?: string
    country: string
  }
}

export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${item.title}${item.size ? ` (Size: ${item.size})` : ""}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.qty}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatPrice(item.price * item.qty)}
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">SneakPeak</h1>
    <p style="margin: 10px 0 0; opacity: 0.9;">Order Confirmation</p>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.customerName},</p>
    
    <p>Thank you for your order! We're excited to get your items to you.</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600;">Order Reference: <span style="color: #667eea;">${data.reference}</span></p>
    </div>
    
    <h2 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333;">Order Details</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 12px; text-align: left;">Item</th>
          <th style="padding: 12px; text-align: center;">Qty</th>
          <th style="padding: 12px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div style="border-top: 2px solid #eee; padding-top: 15px; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Subtotal:</span>
        <span>${formatPrice(data.subtotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Delivery Fee:</span>
        <span>${formatPrice(data.deliveryFee)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #667eea; margin-top: 10px; padding-top: 10px; border-top: 2px solid #667eea;">
        <span>Total:</span>
        <span>${formatPrice(data.total)}</span>
      </div>
    </div>
    
    <h2 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333; margin-top: 30px;">Shipping Address</h2>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
      <p style="margin: 0;">${data.shippingAddress.street}</p>
      <p style="margin: 5px 0;">${data.shippingAddress.city}${data.shippingAddress.region ? `, ${data.shippingAddress.region}` : ""}</p>
      <p style="margin: 0;">${data.shippingAddress.country}</p>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; background: #f0f7ff; border-radius: 8px; text-align: center;">
      <p style="margin: 0; color: #667eea; font-weight: 600;">What's Next?</p>
      <p style="margin: 10px 0 0; color: #666;">We'll send you another email when your order ships. Track your order status in your account.</p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>Questions? Reply to this email or contact us at support@sneakpeak.com</p>
    <p>&copy; 2025 SneakPeak. All rights reserved.</p>
  </div>
</body>
</html>
  `
}

export function generateAdminOrderNotificationEmail(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size || "-"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.qty)}</td>
    </tr>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">New Order Received!</h1>
  </div>
  
  <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-top: none;">
    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0;"><strong>Order ID:</strong> ${data.orderId}</p>
      <p style="margin: 5px 0;"><strong>Reference:</strong> ${data.reference}</p>
      <p style="margin: 0;"><strong>Total:</strong> <span style="color: #10b981; font-size: 18px; font-weight: bold;">${formatPrice(data.total)}</span></p>
    </div>
    
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${data.customerName}</p>
    <p><strong>Email:</strong> ${data.customerEmail}</p>
    
    <h3>Shipping Address</h3>
    <p>${data.shippingAddress.street}<br>
    ${data.shippingAddress.city}${data.shippingAddress.region ? `, ${data.shippingAddress.region}` : ""}<br>
    ${data.shippingAddress.country}</p>
    
    <h3>Order Items</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 8px; text-align: left;">Item</th>
          <th style="padding: 8px; text-align: center;">Qty</th>
          <th style="padding: 8px; text-align: left;">Size</th>
          <th style="padding: 8px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
      <p><strong>Subtotal:</strong> ${formatPrice(data.subtotal)}</p>
      <p><strong>Delivery Fee:</strong> ${formatPrice(data.deliveryFee)}</p>
      <p style="font-size: 18px;"><strong>Total:</strong> ${formatPrice(data.total)}</p>
    </div>
  </div>
</body>
</html>
  `
}
