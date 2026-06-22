"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import type { ShopProduct } from "@/types/shop"

interface ProductCardHoverProps {
  product: ShopProduct
}

export function ProductCardHover({ product }: ProductCardHoverProps) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
    >
      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs text-white/70 line-clamp-2 mb-3">
          {product.categories.map((c) => c.name).join(", ")}
        </p>
        <button className="w-full h-9 bg-white text-black text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
          <ShoppingBag className="h-3 w-3" />
          Quick Add
        </button>
      </div>
    </motion.div>
  )
}
