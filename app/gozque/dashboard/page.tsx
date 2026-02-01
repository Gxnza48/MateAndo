"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, LogOut, Package, ShieldCheck } from "lucide-react"

interface Product {
  id: string
  slug: string
  name_es: string
  description_es: string | null
  price_ars: number
  image_url: string
  category: string
  material: string | null
  stock: number
  rating: number
  featured: boolean
  in_stock: boolean
  created_at?: string
}

const categories = [
  { value: "mate", label: "Mates" },
  { value: "bombilla", label: "Bombillas" },
  { value: "yerba", label: "Yerba" },
  { value: "kit", label: "Kits" },
  { value: "accesorios", label: "Accesorios" },
]

const materials = [
  { value: "Calabaza", label: "Calabaza" },
  { value: "Madera", label: "Madera" },
  { value: "Vidrio", label: "Vidrio" },
  { value: "Ceramica", label: "Ceramica" },
  { value: "Alpaca", label: "Alpaca" },
  { value: "Acero", label: "Acero" },
  { value: "Varios", label: "Varios" },
]

const emptyProduct = {
  slug: "",
  name_es: "",
  description_es: "",
  price_ars: 0,
  image_url: "",
  category: "mates",
  material: "",
  stock: 10,
  rating: 4.5,
  featured: false,
  in_stock: true,
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [dbError, setDbError] = useState(false)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      setDbError(true)
      const { products: fallbackProducts } = await import("@/lib/products")
      setProducts(fallbackProducts as unknown as Product[])
      setLoading(false)
      return
    }

    setDbError(false)
    setProducts(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/gozque")
      } else {
        fetchProducts()
      }
    }
    checkUser()
  }, [router, supabase, fetchProducts])

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error de Configuración</CardTitle>
            <CardDescription>
              No se han encontrado las variables de entorno de Supabase. Por favor asegúrate de que el archivo .env.local
              existe y reinicia el servidor de desarrollo (npm run dev).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/gozque")
  }

  function openCreateDialog() {
    setEditingProduct(emptyProduct)
    setDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  function openDeleteDialog(product: Product) {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    if (!editingProduct) return

    if (dbError) {
      alert(
        "La base de datos no está disponible. Por favor, configura Supabase correctamente para poder agregar y editar productos."
      )
      setSaving(false)
      return
    }

    setSaving(true)

    const productData = {
      slug: editingProduct.slug,
      name_es: editingProduct.name_es,
      description_es: editingProduct.description_es || null,
      price_ars: Number(editingProduct.price_ars),
      image_url: editingProduct.image_url || "/placeholder.svg?height=400&width=400",
      category: editingProduct.category,
      material: editingProduct.material || null,
      stock: Number(editingProduct.stock) || 10,
      rating: Number(editingProduct.rating) || 4.5,
      featured: editingProduct.featured || false,
      in_stock: editingProduct.in_stock !== false,
    }

    if ("id" in editingProduct && editingProduct.id) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)

      if (error) {
        console.error("Error updating product:", error)
        alert(
          `Error actualizando producto: ${error.message}\n\nPor favor, ejecuta el script SQL en Supabase para crear la tabla 'products'.`
        )
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from("products").insert(productData)

      if (error) {
        console.error("Error creating product:", error)
        alert(
          `Error creando producto: ${error.message}\n\nPor favor, ejecuta el script SQL en Supabase para crear la tabla 'products'.\n\nPuedes encontrar el script en: scripts/001_create_tables.sql`
        )
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setDialogOpen(false)
    setEditingProduct(null)
    fetchProducts()
  }

  async function handleDelete() {
    if (!productToDelete) return

    const { error } = await supabase.from("products").delete().eq("id", productToDelete.id)

    if (error) {
      console.error("Error deleting product:", error)
      return
    }

    setDeleteDialogOpen(false)
    setProductToDelete(null)
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Panel de Administracion</h1>
          <p className="text-muted-foreground">Gestiona los productos de MateAR</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
          <Button variant="outline" onClick={handleLogout} className="bg-transparent">
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>

      {dbError && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldCheck className="h-5 w-5" />
              Base de Datos No Configurada
            </CardTitle>
            <CardDescription>
              La tabla de productos no existe en Supabase. Mostrando productos de ejemplo. Para poder crear y editar
              productos, ejecuta el script SQL ubicado en{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">scripts/001_create_tables.sql</code> en tu proyecto
              de Supabase.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos ({products.length}) {dbError && <Badge variant="outline">Solo Lectura</Badge>}
          </CardTitle>
          <CardDescription>Lista de todos los productos disponibles en la tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Precio (ARS)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name_es}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${product.price_ars.toLocaleString("es-AR")}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? "En stock" : "Sin stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.featured && <Badge variant="outline">Destacado</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                        className="bg-transparent"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(product)}
                        className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct && "id" in editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>Complete los campos para guardar el producto</DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={editingProduct.slug || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="mate-imperial"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={editingProduct.category || "mates"}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_es">Nombre del Producto</Label>
                <Input
                  id="name_es"
                  value={editingProduct.name_es || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name_es: e.target.value })}
                  placeholder="Mate Imperial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_es">Descripcion</Label>
                <Textarea
                  id="description_es"
                  value={editingProduct.description_es || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_es: e.target.value })}
                  placeholder="Descripcion del producto..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_ars">Precio (ARS)</Label>

                  {/* FIX: ahora es texto (más cómodo), pero seguimos guardando un número */}
                  <Input
                    id="price_ars"
                    type="text"
                    inputMode="numeric"
                    value={editingProduct.price_ars?.toString() ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value
                      const cleaned = raw.replace(/[^\d]/g, "")
                      setEditingProduct({
                        ...editingProduct,
                        price_ars: cleaned === "" ? 0 : Number(cleaned),
                      })
                    }}
                    placeholder="15000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={editingProduct.material || ""}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, material: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((mat) => (
                        <SelectItem key={mat.value} value={mat.value} className="capitalize">
                          {mat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={editingProduct.rating || 4.5}
                  onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                  placeholder="4.5"
                  className="w-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={editingProduct.featured || false}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, featured: checked })}
                  />
                  <Label htmlFor="featured">Producto Destacado</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="in_stock"
                    checked={editingProduct.in_stock !== false}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, in_stock: checked })}
                  />
                  <Label htmlFor="in_stock">En Stock</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminacion</DialogTitle>
            <DialogDescription>
              Estas seguro de que deseas eliminar el producto &quot;{productToDelete?.name_es}&quot;? Esta accion no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
