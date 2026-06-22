"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { FeaturedProduct } from "@/types/product"

interface AiRecommendationsProps {
  products: FeaturedProduct[]
  title?: string
  icon?: boolean
}

export function AiRecommendations({ products, title = "Recommended for You", icon = true }: AiRecommendationsProps) {
  const router = useRouter()

  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {icon && <Sparkles className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />}
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <motion.button
              key={product.id}
              type="button"
              onClick={() => router.push(`/${product.slug}`)}
              className="text-left group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aspect-square border border-border bg-secondary overflow-hidden mb-3 relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.imageAlt ?? product.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                ${product.price.toFixed(2)}
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="line-through ml-1.5 text-xs">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
