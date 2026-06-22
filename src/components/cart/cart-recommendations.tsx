"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import type { FeaturedProduct } from "@/types/product"

interface CartRecommendationsProps {
  productIds: string[]
}

export function CartRecommendations({ productIds }: CartRecommendationsProps) {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const router = useRouter()

  useEffect(() => {
    if (productIds.length === 0) return
    fetch("/api/recommendations/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
  }, [productIds])

  if (products.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <h3 className="text-sm font-semibold tracking-tight">You May Also Like</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((product) => (
          <motion.button
            key={product.id}
            type="button"
            onClick={() => router.push(`/${product.slug}`)}
            className="text-left group"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="aspect-square border border-border bg-secondary overflow-hidden mb-2 relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.imageAlt ?? product.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  sizes="180px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-7 h-7 bg-background border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
            </div>
            <h4 className="text-xs font-medium truncate">{product.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              ${product.price.toFixed(2)}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
