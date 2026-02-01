"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-4xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Producto no encontrado / Product not found
      </p>
      <Button className="mt-6" asChild>
        <Link href="/store">Volver a la tienda</Link>
      </Button>
    </div>
  )
}
