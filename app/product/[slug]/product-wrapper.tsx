"use client"

import React from "react"

import { useStore } from "@/contexts/store-context"
import { Loader2 } from "lucide-react"

export function ProductPageWrapper({ children }: { children: React.ReactNode }) {
  const { mounted } = useStore()

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <div className="min-h-screen bg-background">{children}</div>
}
