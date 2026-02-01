"use client"

import React from "react"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, ChevronDown, Loader2, PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/contexts/store-context"
import { products as fallbackProducts, normalizeProduct } from "@/lib/products"
import type { Product } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

type SortOption = "featured" | "price-asc" | "price-desc" | "rating"

export default function StorePage() {
  const { t } = useStore()
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000
    return Math.max(...products.map((p) => p.price_ars))
  }, [products])

  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100000]) // Initial safe default

  // Update price range when maxPrice changes (if it was default)
  useEffect(() => {
    if (priceRange[1] === 100000 && maxPrice !== 100000) {
      setPriceRange([1, maxPrice])
    }
  }, [maxPrice])
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch products from Supabase with fallback
  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching products:", error.message)
          // Fallback already set in useState(fallbackProducts), but ensuring it:
          setProducts(fallbackProducts)
        } else if (data && data.length > 0) {
          try {
            const normalized = data.map(normalizeProduct)
            setProducts(normalized)
          } catch (normalizationError) {
            console.error("Normalization Error:", normalizationError)
            setProducts(fallbackProducts)
          }
        }
      } catch (err) {
        console.error("Critical Error:", err)
      }
    }

    fetchProducts()
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Get search suggestions
  const suggestions = useMemo(() => {
    if (search.length < 2) return []
    const searchLower = search.toLowerCase()
    return products
      .filter((p) => {
        const name = p.name_es
        return name.toLowerCase().includes(searchLower)
      })
      .slice(0, 5)
  }, [search, products])

  // Derive dynamic filters from products
  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(cats)
  }, [products])

  const uniqueMaterials = useMemo(() => {
    const mats = new Set(products.map(p => p.material).filter(Boolean))
    return Array.from(mats)
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      result = result.filter((p) => {
        const name = p.name_es
        const desc = p.description_es
        return (
          name.toLowerCase().includes(searchLower) ||
          desc.toLowerCase().includes(searchLower)
        )
      })
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Material filter
    if (selectedMaterial) {
      result = result.filter((p) => p.material === selectedMaterial)
    }

    // Price filter
    result = result.filter(
      (p) => {
        const price = p.price_ars || 0
        return price >= priceRange[0] && price <= priceRange[1]
      }
    )

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price_ars - b.price_ars)
        break
      case "price-desc":
        result.sort((a, b) => b.price_ars - a.price_ars)
        break
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // Featured - sort by rating then by id
        result.sort((a, b) => ((b.rating || 0) - (a.rating || 0)) || (a.slug.localeCompare(b.slug)))
    }

    return result
  }, [products, debouncedSearch, selectedCategory, selectedMaterial, priceRange, sortBy])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (highlightedIndex >= 0) {
            const selected = suggestions[highlightedIndex]
            setSearch(selected.name_es)
            setShowSuggestions(false)
          }
          break
        case "Escape":
          setShowSuggestions(false)
          break
      }
    },
    [showSuggestions, suggestions, highlightedIndex]
  )

  const selectSuggestion = (product: Product) => {
    setSearch(product.name_es)
    setShowSuggestions(false)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory(null)
    setSelectedMaterial(null)
    setPriceRange([1, maxPrice])
    setSortBy("featured")
  }

  const hasActiveFilters =
    search || selectedCategory || selectedMaterial || priceRange[0] > 1 || priceRange[1] < maxPrice

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: t("store.sort.featured") },
    { value: "price-asc", label: t("store.sort.price-asc") },
    { value: "price-desc", label: t("store.sort.price-desc") },
    { value: "rating", label: t("store.sort.rating") },
  ]

  const filterProps = {
    selectedCategory,
    setSelectedCategory,
    uniqueCategories,
    selectedMaterial,
    setSelectedMaterial,
    uniqueMaterials,
    priceRange,
    setPriceRange,
    maxPrice,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t("store.title")}
          </motion.h1>
        </div>
      </div>

      {/* Search Bar - Sticky */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div ref={searchRef} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setShowSuggestions(true)
                  setHighlightedIndex(-1)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={t("store.search")}
                className="pl-10 pr-10"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
                  >
                    {suggestions.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => selectSuggestion(product)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${index === highlightedIndex
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                          }`}
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {product.name_es}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    {t("store.sort")}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={sortBy === option.value ? "font-semibold" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filters - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-4">
                  <StoreFilters {...filterProps} />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filters - Mobile */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <StoreFilters {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className="mt-2 text-sm text-muted-foreground">
            {filteredProducts.length} {t("store.results")}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <PackageX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              {t("store.empty")}
            </h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              No encontramos productos con los filtros seleccionados. Intenta con otros criterios.
            </p>
            <Button className="mt-6" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface StoreFiltersProps {
  selectedCategory: string | null
  setSelectedCategory: (val: string | null) => void
  uniqueCategories: string[]
  selectedMaterial: string | null
  setSelectedMaterial: (val: string | null) => void
  uniqueMaterials: string[]
  priceRange: [number, number]
  setPriceRange: (val: [number, number]) => void
  maxPrice: number
}

function StoreFilters({
  selectedCategory,
  setSelectedCategory,
  uniqueCategories,
  selectedMaterial,
  setSelectedMaterial,
  uniqueMaterials,
  priceRange,
  setPriceRange,
  maxPrice,
}: StoreFiltersProps) {
  const { t } = useStore()
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">
          {t("store.filter.category")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t("store.filter.all")}
          </Button>
          {uniqueCategories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">
          {t("store.filter.material")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedMaterial === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMaterial(null)}
          >
            {t("store.filter.all")}
          </Button>
          {uniqueMaterials.slice(0, 10).map((mat) => (
            <Button
              key={mat}
              variant={selectedMaterial === mat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMaterial(mat)}
              className="capitalize"
            >
              {mat}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-medium text-foreground">
          {t("store.filter.price")} (ARS)
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Min</span>
            <Input
              type="number"
              value={priceRange[0] === 0 ? "" : priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-24"
              placeholder="Min"
            />
          </div>
          <span className="text-muted-foreground mt-5">-</span>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Max</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-24"
              placeholder={maxPrice.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
