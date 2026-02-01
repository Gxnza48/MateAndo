"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { createClient } from "@/lib/supabase/client"
import { normalizeProduct, products as fallbackProducts } from "@/lib/products"
import { useStore } from "@/contexts/store-context"
import { useEffect, useState } from "react"
import { Product } from "@/lib/types"

export function FeaturedProducts() {
  const { t } = useStore()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient()
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .limit(4)

      if (data && data.length > 0) {
        setFeaturedProducts(data.map(normalizeProduct))
      } else {
        // Fallback logic: check static products
        setFeaturedProducts(fallbackProducts.filter(p => p.featured).slice(0, 4))
      }
    }
    fetchFeatured()
  }, [])

  if (featuredProducts.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {t("products.featured")}
            </h2>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/store">
              {t("products.all")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
