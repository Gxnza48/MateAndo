"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { formatPrice } from "@/lib/config"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, t } = useStore()
  const [added, setAdded] = useState(false)
  const currency = "USD"; // Declare the currency variable

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const name = product.name_es
  const productImage = product.image_url || product.image || "/placeholder.svg?height=400&width=400"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Quick Add Button */}
            <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg"
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-medium text-foreground line-clamp-1">{name}</h3>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {(product.rating || 4.5).toFixed(1)}
              </span>
              {product.material && (
                <span className="text-sm text-muted-foreground">
                  &middot; {product.material}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price_ars)}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="md:hidden bg-transparent"
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? t("products.added") : t("products.add")}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
