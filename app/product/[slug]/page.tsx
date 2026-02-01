import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ArrowLeft, Package } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getProductBySlug, getRelatedProducts, normalizeProduct } from "@/lib/products"
import { formatPrice } from "@/lib/config"
import { ProductClient } from "./product-client"
import { ProductPageWrapper } from "./product-wrapper"
import { createClient } from "@/lib/supabase/client"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  // Try fetching from Supabase first
  const supabase = createClient()
  const { data: dbProduct } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  let product = dbProduct ? normalizeProduct(dbProduct) : undefined

  // Fallback to static products if not found in DB
  if (!product) {
    product = getProductBySlug(slug)
  }

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product)
  const name = product.name_es
  const description = product.description_es
  const productImage = product.image_url || product.image || "/placeholder.svg?height=400&width=400"
  const productRating = product.rating || 4.5
  const productStock = product.stock || (product.in_stock ? 100 : 0)

  return (
    <ProductPageWrapper>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Main Image Only (No Gallery) */}
          <div className="animate-fade-in-left">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm">
              <Image
                src={productImage}
                alt={name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in-right flex flex-col">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(productRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {productRating.toFixed(1)}
              </span>
            </div>

            {/* Price */}
            <p className="mt-4 text-3xl font-bold text-primary">
              {formatPrice(product.price_ars)}
            </p>

            {/* Description */}
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* Specs */}
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              {product.material && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium capitalize text-foreground">
                    {product.material}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Package className="h-4 w-4" />
                  {productStock > 0 ? `${productStock} disponibles` : "Sin stock"}
                </span>
              </div>
            </div>

            {/* Add to Cart Client Component */}
            <ProductClient product={product} productStock={productStock} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Productos Relacionados
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </ProductPageWrapper>
  )
}
