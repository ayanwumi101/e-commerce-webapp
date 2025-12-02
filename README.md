# SneakPeak - E-Commerce Web Application

A modern, animated e-commerce web application for sneakers and wears, built with Next.js, TypeScript, Framer Motion, GSAP, and Prisma.

## Features

- **Animated Landing Page** - Hero carousel, scroll-triggered animations, parallax effects
- **Product Catalog** - Filterable product grid with categories, sizes, and price range
- **Shopping Cart** - Persistent cart with real-time updates
- **Secure Checkout** - Paystack payment integration
- **Flat-Rate Delivery** - Simple constant delivery fee
- **User Authentication** - NextAuth with credentials provider
- **Admin Dashboard** - Order management and status updates
- **Email Notifications** - Order confirmation emails via Resend

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Framer Motion (animations & page transitions)
- GSAP + ScrollTrigger (scroll-triggered animations)
- shadcn/ui (UI components)
- Tailwind CSS (styling with glassmorphism)
- Zod (validation)
- React Hook Form (forms)
- SWR (data fetching)

### Backend
- Next.js API Routes
- Prisma ORM
- Neon (PostgreSQL)
- NextAuth.js (authentication)
- Paystack (payments)
- Resend (emails)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon database account
- Paystack account
- Resend account (free tier: 3000 emails/month)

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxx

# Email (Resend - see setup instructions below)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev

# Delivery Fee (flat rate in NGN)
DELIVERY_FEE=1500

# Admin Notification Email
OWNER_EMAIL=ayanwumi101@gmail.com
\`\`\`

### Email Setup with Resend (Recommended)

Resend is the easiest email provider to set up - just one API key needed!

1. Go to [https://resend.com](https://resend.com) and sign up (FREE: 3000 emails/month)
2. Navigate to **API Keys** in your dashboard
3. Click **Create API Key** and copy it
4. Add `RESEND_API_KEY=re_your_key_here` to your environment variables
5. For testing, use `EMAIL_FROM=onboarding@resend.dev` (works immediately)
6. For production, add your own domain in Resend dashboard

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd sneakpeak
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up the database:
\`\`\`bash
# Run the SQL scripts in order
# 001-create-tables.sql - Creates all tables
# 002-seed-data.sql - Seeds initial data
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main models:

- **User** - User accounts with authentication
- **Address** - User shipping addresses
- **Product** - Product catalog with categories and sizes
- **CartItem** - Shopping cart items
- **Order** - Customer orders with items and status
- **OrderItem** - Individual items within an order

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/[itemId]` - Remove item

### Checkout & Orders
- `POST /api/checkout/create` - Create order and get payment data
- `POST /api/checkout/verify` - Verify payment
- `GET /api/orders` - List user's orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]/status` - Update order status (admin)

### Webhooks
- `POST /api/webhooks/paystack` - Paystack payment webhook

### Utilities
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## Delivery Fee

The delivery fee is a flat rate configured via the `DELIVERY_FEE` environment variable (default: ₦1,500).

## Testing

Run the test suite:

\`\`\`bash
npm test
\`\`\`

Tests cover:
- Delivery fee calculation
- Paystack transaction verification
- Webhook signature verification

## Animations

### Framer Motion
- Page transitions (fade + slide)
- Card hover effects
- Modal animations
- Staggered list animations

### GSAP ScrollTrigger
- Hero parallax effect
- Section reveal animations
- Text entrance animations
- Image scale effects

All animations respect `prefers-reduced-motion` for accessibility.

## Admin Dashboard

Access the admin dashboard at `/admin` (requires admin user).

Features:
- View all orders
- Update order status
- View revenue statistics
- Manage products

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start production server:
\`\`\`bash
npm start
\`\`\`

## License

MIT License
