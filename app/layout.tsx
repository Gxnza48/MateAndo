import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/contexts/store-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "MateAR - Premium Argentinian Mate Products",
  description:
    "Discover the Argentinian mate experience with premium quality products, modern design and artisanal tradition. Mates, bombillas, thermos and yerba mate.",
  keywords: ["mate", "argentina", "yerba mate", "bombilla", "termo", "artesanal"],
  authors: [{ name: "Gonza_Bonadeo", url: "https://github.com/Gxnza48" }],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#2d2a26" },
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
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <StoreProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartDrawer />
              <ScrollToTop />
            </CurrencyProvider>
          </LanguageProvider>
        </StoreProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
