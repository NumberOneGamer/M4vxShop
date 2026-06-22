"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 border border-border bg-secondary flex items-center justify-center mb-6">
        <ShoppingBag className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold tracking-tight mb-2">Your cart is empty</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
      </p>
      <Button asChild className="rounded-none text-sm h-11 px-8">
        <Link href="/shop">Shop Now</Link>
      </Button>
    </div>
  )
}
