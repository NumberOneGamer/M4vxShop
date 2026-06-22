"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { FeaturedProduct } from "@/types/product"
import { useRouter } from "next/navigation"

interface RelatedProductsProps {
  products: FeaturedProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  if (products.length === 0) return null

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            You May Also Like
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-8 h-8 flex items-center justify-center border border-border hover:border-muted-foreground/50 transition-colors"
              aria-label="Scroll related products left"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-8 h-8 flex items-center justify-center border border-border hover:border-muted-foreground/50 transition-colors"
              aria-label="Scroll related products right"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-4 px-4"
        >
          {products.map((product) => (
            <motion.button
              key={product.id}
              type="button"
              onClick={() => router.push(`/${product.slug}`)}
              className="flex-shrink-0 w-[200px] sm:w-[240px] snap-start text-left group"
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
                    sizes="240px"
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
