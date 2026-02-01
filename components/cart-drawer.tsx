"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { formatPrice, generateWhatsAppLink } from "@/lib/config"

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    t,
  } = useStore()

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
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-[100] w-full max-w-md bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t("cart.title")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-lg font-medium text-foreground">
                      {t("cart.empty")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("cart.empty.desc")}
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setCartOpen(false)}
                      asChild
                    >
                      <Link href="/store">{t("cart.continue")}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 rounded-lg border border-border bg-card p-3"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.product.image_url || item.product.image || "/placeholder.svg?height=80&width=80"}
                            alt={item.product.name_es}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <h3 className="text-sm font-medium text-foreground">
                            {item.product.name_es}
                          </h3>
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(item.product.price_ars)}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-medium text-foreground">
                      {t("cart.total")}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full gap-2" asChild>
                      <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {t("cart.whatsapp")}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setCartOpen(false)}
                      asChild
                    >
                      <Link href="/cart">{t("cart.title")}</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
