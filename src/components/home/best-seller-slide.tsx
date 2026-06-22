"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"
import type { BestSellerProduct } from "@/types/product"

interface BestSellerSlideProps {
  product: BestSellerProduct
  rank: number
}

export function BestSellerSlide({ product, rank }: BestSellerSlideProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/${product.slug}`}
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full border border-border bg-background overflow-hidden group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image ?? "/placeholder.svg"}
            alt={product.imageAlt ?? product.name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "scale-110 grayscale-0" : "scale-100 grayscale"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/0 transition-colors duration-500",
              isHovered && "bg-black/5"
            )}
          />
          <div className="absolute top-3 left-3 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm">
            {rank}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-heading font-semibold text-sm leading-tight tracking-tight line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(product.averageRating)
                      ? "fill-foreground text-foreground"
                      : "fill-none text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-base">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <motion.div
            className="pt-1"
            initial={{ opacity: 0, y: 8 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              className="w-full h-9 bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}
