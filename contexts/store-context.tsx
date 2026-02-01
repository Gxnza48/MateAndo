"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type { CartItem, Product, Theme } from "@/lib/types"
import { translations, type TranslationKey } from "@/lib/translations"

interface StoreContextType {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  
  // Translation
  t: (key: TranslationKey) => string
  
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Cart Drawer
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  
  // Mounted state
  mounted: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [theme, setThemeState] = useState<Theme>("light")
  const [isCartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem("mate-cart")
    const savedTheme = localStorage.getItem("mate-theme") as Theme

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedTheme) {
      setThemeState(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  // Persist cart
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mate-cart", JSON.stringify(cart))
    }
  }, [cart, mounted])

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price_ars * item.quantity,
    0
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Translation (Spanish only)
  const t = useCallback(
    (key: TranslationKey): string => {
      const translation = translations[key]
      if (!translation) return key
      return translation.es
    },
    []
  )

  // Theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("mate-theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }, [])

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        t,
        theme,
        setTheme,
        isCartOpen,
        setCartOpen,
        mounted,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
