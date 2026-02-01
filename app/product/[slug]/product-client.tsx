"use client"

import { useState } from "react"
import { Star, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import type { Product } from "@/lib/types"

interface ProductClientProps {
  product: Product
  productStock: number
}

export function ProductClient({ product, productStock }: ProductClientProps) {
  const { addToCart, t } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Quantity */}
      <div className="flex items-center rounded-lg border border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-r-none"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-l-none"
          onClick={() => setQuantity(Math.min(productStock, quantity + 1))}
          disabled={quantity >= productStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Button */}
      <Button
        size="lg"
        className="flex-1 gap-2"
        onClick={handleAddToCart}
        disabled={productStock === 0 || added}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            {t("products.added")}
          </>
        ) : (
          t("products.add")
        )}
      </Button>
    </div>
  )
}
