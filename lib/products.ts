import type { Product } from "./types"

// Static fallback products (Spanish only, ARS only)
export const products: Product[] = [
  {
    id: "1",
    slug: "mate-imperial",
    category: "mates",
    name_es: "Mate Imperial",
    description_es: "Mate de ceramica artesanal con diseño elegante y moderno. Perfecto para los que valoran el estilo y la tradicion.",
    price_ars: 15000,
    material: "ceramica",
    stock: 25,
    rating: 4.9,
    image: "https://thehouseofmate.com/cdn/shop/files/69A55BE3-7BEB-42A0-A5FB-160F0275BC71.jpg?v=1723560623&width=713",
    featured: true,
    in_stock: true,
  },
  {
    id: "2",
    slug: "mate-torpedo",
    category: "mates",
    name_es: "Mate Torpedo",
    description_es: "Mate de forma torpedo, diseño ergonomico tradicional. Material resistente y duradero para disfrutar el mate autentico.",
    price_ars: 18000,
    material: "calabaza",
    stock: 30,
    rating: 4.8,
    image: "https://thehouseofmate.com/cdn/shop/files/27CA003A-D98C-45DB-BE09-3E8B148E564A.jpg?v=1723560799&width=713",
    featured: true,
    in_stock: true,
  },
  {
    id: "3",
    slug: "bombilla-pico-de-loro",
    category: "bombillas",
    name_es: "Bombilla Pico de Loro",
    description_es: "Bombilla de alpaca con el clasico diseño pico de loro. Filtro de calidad premium para una experiencia optima.",
    price_ars: 8500,
    material: "alpaca",
    stock: 50,
    rating: 4.9,
    image: "https://thehouseofmate.com/cdn/shop/files/bombillas_e73d8811-dbaf-4cb9-b564-ae7dcfefea40.jpg?v=1715308072&width=713",
    featured: true,
    in_stock: true,
  },
  {
    id: "4",
    slug: "set-matero",
    category: "kits",
    name_es: "Set Matero",
    description_es: "Set completo del matero: termo con capacidad de 1L, mate artesanal y bombilla pico de loro. Todo lo que necesitas para disfrutar el mate como un verdadero argentino.",
    price_ars: 45000,
    material: "varios",
    stock: 12,
    rating: 5.0,
    image: "https://thehouseofmate.com/cdn/shop/files/TERMO_MATE_BOMBILLA.png?v=1746855733&width=713",
    featured: true,
    in_stock: true,
  }
]

export const categories = [
  { id: "mates", name_es: "Mates" },
  { id: "bombillas", name_es: "Bombillas" },
  { id: "yerba", name_es: "Yerba" },
  { id: "kits", name_es: "Kits" },
  { id: "accesorios", name_es: "Accesorios" },
]

export const materials = [
  "calabaza",
  "ceramica",
  "madera",
  "vidrio",
  "alpaca",
  "acero",
  "varios",
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}

// Normalize product from database format
export function normalizeProduct(dbProduct: Record<string, unknown>): Product {
  const imageUrl = (dbProduct.image_url as string) || (dbProduct.image as string) || "/placeholder.svg?height=400&width=400"
  return {
    id: String(dbProduct.id || Math.random().toString()),
    slug: String(dbProduct.slug || "product-" + Math.random().toString().slice(2, 8)),
    category: String(dbProduct.category || "varios"),
    name_es: String(dbProduct.name_es || "Producto sin nombre"),
    description_es: (dbProduct.description_es as string) || "",
    price_ars: Number(dbProduct.price_ars) || 0,
    material: (dbProduct.material as string) || null,
    image: imageUrl,
    image_url: imageUrl,
    featured: Boolean(dbProduct.featured),
    in_stock: dbProduct.in_stock !== false,
    rating: Number(dbProduct.rating) || 4.5,
    stock: Number(dbProduct.stock) || 10,
  }
}
