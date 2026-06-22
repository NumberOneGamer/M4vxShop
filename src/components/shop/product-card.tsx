"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ShopProduct } from "@/types/shop"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: ShopProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  return (
    <motion.div
      className="group relative border border-border bg-background overflow-hidden cursor-pointer"
      onClick={() => router.push(`/${product.slug}`)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="aspect-square overflow-hidden bg-secondary relative">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Add to wishlist"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>

        {product.isNew && (
          <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-widest bg-foreground text-background px-2 py-1">
            New
          </span>
        )}
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-medium leading-tight truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {"★".repeat(Math.round(product.averageRating))}
            {"☆".repeat(5 - Math.round(product.averageRating))}
          </span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className={cn(
            "w-full mt-2 h-9 text-xs font-medium tracking-wider uppercase",
            "bg-foreground text-background hover:opacity-90 transition-opacity",
            "flex items-center justify-center gap-2"
          )}
        >
          <ShoppingBag className="h-3 w-3" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
