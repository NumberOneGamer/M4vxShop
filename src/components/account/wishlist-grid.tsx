"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string | null
  slug: string
}

interface WishlistGridProps {
  items: WishlistItem[]
  onRemove: (productId: string) => void
  loading?: boolean
}

export function WishlistGrid({ items, onRemove, loading }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" strokeWidth={1.5} />
        <p className="text-muted-foreground mb-6">Your wishlist is empty.</p>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.productId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group border border-border"
        >
          <Link href={`/${item.slug}`}>
            <div className="aspect-square bg-secondary overflow-hidden relative">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
          </Link>
          <div className="p-3 space-y-2">
            <Link href={`/${item.slug}`}>
              <p className="text-sm font-medium truncate group-hover:text-muted-foreground transition-colors">
                {item.name}
              </p>
            </Link>
            <p className="text-sm">{formatPrice(item.price)}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-none text-xs"
              onClick={() => onRemove(item.productId)}
              disabled={loading}
            >
              <ShoppingBag className="h-3 w-3 mr-1.5" strokeWidth={1.5} />
              Remove
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
