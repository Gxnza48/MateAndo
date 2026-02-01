"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { formatPrice, generateWhatsAppLink } from "@/lib/config"
import { useLanguage } from "@/contexts/language-context" // Import language context
import { useCurrency } from "@/contexts/currency-context" // Import currency context

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, t, mounted } = useStore()
  const { language } = useLanguage()
  const { currency } = useCurrency()

  // Prevent rendering until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">{t("cart.loading")}</p>
      </div>
    )
  }

  const whatsAppItems = cart.map((item) => ({
    name: item.product.name_es,
    quantity: item.quantity,
    price: formatPrice(item.product.price_ars * item.quantity),
  }))

  const whatsAppLink = generateWhatsAppLink(
    whatsAppItems,
    formatPrice(cartTotal)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/store"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("cart.continue")}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t("cart.title")}
          </motion.h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
            <h2 className="mt-6 text-xl font-semibold text-foreground">
              {t("cart.empty")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("cart.empty.desc")}</p>
            <Button className="mt-6" asChild>
              <Link href="/store">{t("cart.continue")}</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4 sm:gap-6 sm:p-6"
                  >
                    {/* Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32">
                      <Image
                        src={item.product.image_url || item.product.image || "/placeholder.svg"}
                        alt={item.product.name_es}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {item.product.name_es}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.product.material}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t("cart.remove")}</span>
                        </Button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(item.product.price_ars * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 rounded-xl border border-border bg-card p-6"
              >
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t("cart.checkout")}
                </h2>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("cart.subtotal")}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("features.shipping")}
                    </span>
                    <span className="text-muted-foreground">
                      A coordinar
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                      {t("cart.total")}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <Button className="mt-6 w-full gap-2" size="lg" asChild>
                  <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    {t("cart.whatsapp")}
                  </a>
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {language === "es" ? "Coordinaremos el pago y envío por WhatsApp" : "We'll coordinate payment and shipping via WhatsApp"}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
