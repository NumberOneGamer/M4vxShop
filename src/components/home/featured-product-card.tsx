"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"
import type { FeaturedProduct } from "@/types/product"

interface FeaturedProductCardProps {
  product: FeaturedProduct
  index: number
}

export function FeaturedProductCard({
  product,
  index,
}: FeaturedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <motion.div
      className="flex-shrink-0 w-[350px] md:w-[480px]"
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link
        href={`/${product.slug}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex h-[240px] border border-border bg-background overflow-hidden"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative w-1/2 overflow-hidden bg-secondary">
            <Image
              src={product.image ?? "/placeholder.svg"}
              alt={product.imageAlt ?? product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                isHovered ? "scale-105 grayscale-0" : "scale-100 grayscale"
              )}
              sizes="240px"
            />
            <div
              className={cn(
                "absolute inset-0 bg-black/0 transition-colors duration-500",
                isHovered && "bg-black/10"
              )}
            />
          </div>

          <div className="flex w-1/2 flex-col justify-between p-5">
            <div>
              <h3 className="font-heading font-semibold text-lg leading-tight tracking-tight line-clamp-2">
                {product.name}
              </h3>
              {product.shortDescription && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-semibold text-xl">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                )}
              >
                <button
                  type="button"
                  className="flex-1 h-10 bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="h-10 w-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsWishlisted(!isWishlisted)
                  }}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isWishlisted && "fill-foreground"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
