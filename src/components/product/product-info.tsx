"use client"

import { motion } from "framer-motion"
import { Package, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PriceDisplay } from "@/components/shared/price-display"
import { sanitizeHtml } from "@/lib/sanitize"
import { RatingStars } from "@/components/shared/rating-stars"

interface ProductInfoProps {
  name: string
  description: string
  shortDescription: string | null
  price: number
  comparePrice: number | null
  stock: number
  isNew: boolean
  isBestSeller: boolean
  sku: string | null
  averageRating: number
  reviewCount: number
}

export function ProductInfo({
  name,
  description,
  shortDescription,
  price,
  comparePrice,
  stock,
  isNew,
  isBestSeller,
  sku,
  averageRating,
  reviewCount,
}: ProductInfoProps) {
  const inStock = stock > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isNew && (
            <Badge variant="default" className="rounded-none text-[10px] uppercase tracking-widest font-medium h-5 px-2">
              New
            </Badge>
          )}
          {isBestSeller && (
            <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-medium h-5 px-2">
              Best Seller
            </Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
          {name}
        </h1>

        {shortDescription && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <RatingStars rating={averageRating} showValue reviewCount={reviewCount} size="sm" />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <PriceDisplay price={price} comparePrice={comparePrice} size="lg" />

        <div className="flex items-center gap-2">
          {inStock ? (
            <>
              <CheckCircle className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground">In Stock ({stock} available)</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Out of Stock</span>
          )}
        </div>

        {sku && (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-xs text-muted-foreground">SKU: {sku}</span>
          </div>
        )}
      </div>

      <Separator />

      <div
        className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(description),
        }}
      />
    </motion.div>
  )
}
