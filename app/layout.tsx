import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Sneakers & Wears | Premium Footwear & Fashion",
  description:
    "Discover premium sneakers and fashion wear. Shop the latest styles from top brands with fast delivery across Nigeria.",
  keywords: ["sneakers", "fashion", "wears", "shoes", "clothing", "Nigeria"],
  authors: [{ name: "Sneakers & Wears" }],
  openGraph: {
    title: "Sneakers & Wears | Premium Footwear & Fashion",
    description: "Discover premium sneakers and fashion wear.",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
