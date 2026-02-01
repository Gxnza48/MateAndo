export interface Product {
  id: string
  slug: string
  category: string
  name_es: string
  description_es: string
  price_ars: number
  material: string | null
  stock: number
  rating: number
  image: string
  image_url?: string
  featured: boolean
  in_stock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Language = "es" | "en"
export type Currency = "ARS" | "USD"
export type Theme = "light" | "dark"

export interface Translations {
  [key: string]: {
    es: string
    en: string
  }
}
