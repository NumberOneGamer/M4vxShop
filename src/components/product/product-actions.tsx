"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Heart, Share2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductActionsProps {
  stock: number
  className?: string
}

export function ProductActions({ stock, className }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const inStock = stock > 0

  const decrease = () => setQuantity((q) => Math.max(1, q - 1))
  const increase = () => setQuantity((q) => Math.min(stock, q + 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className={cn("space-y-4", className)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={quantity >= stock}
            className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <Button
          size="lg"
          disabled={!inStock}
          className="flex-1 rounded-none gap-2 text-sm h-12"
          asChild
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </motion.button>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider transition-colors",
            "border border-border hover:border-muted-foreground/50",
            isWishlisted && "border-foreground"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("w-3.5 h-3.5", isWishlisted && "fill-foreground")}
            strokeWidth={1.5}
          />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider transition-colors border border-border hover:border-muted-foreground/50"
          aria-label="Share product"
        >
          <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          Share
        </button>
      </div>
    </motion.div>
  )
}
