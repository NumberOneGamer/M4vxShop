"use client"

import { cn } from "@/lib/utils"
import type { ProductDetailVariant } from "@/types/product"

interface VariantSelectorProps {
  variants: ProductDetailVariant[]
  selectedId: string | null
  onSelect: (variant: ProductDetailVariant) => void
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) return null

  const uniqueNames = Array.from(new Set(variants.map((v) => v.name)))

  return (
    <div className="space-y-3">
      {uniqueNames.map((name) => {
        const group = variants.filter((v) => v.name === name)
        return (
          <div key={name}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              {name}
            </label>
            <div className="flex flex-wrap gap-2">
              {group.map((variant) => {
                const isSelected = variant.id === selectedId
                const isOutOfStock = variant.stock === 0
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onSelect(variant)}
                    className={cn(
                      "relative px-4 py-2.5 text-sm border transition-all duration-200",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background hover:border-muted-foreground/50",
                      isOutOfStock && "opacity-40 cursor-not-allowed line-through"
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${variant.sku ?? name} - ${variant.price ? `$${variant.price}` : ""}${isOutOfStock ? " (Out of Stock)" : ""}`}
                  >
                    <span className="relative z-10">
                      {variant.sku ?? name}
                      {variant.price && (
                        <span className="ml-2 text-xs opacity-70">
                          +${(variant.price / 100).toFixed(2)}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
