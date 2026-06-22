"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FeaturedProductCard } from "./featured-product-card"
import type { FeaturedProduct } from "@/types/product"

interface FeaturedProductsClientProps {
  products: FeaturedProduct[]
}

export function FeaturedProductsClient({
  products,
}: FeaturedProductsClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 500
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  if (products.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Featured
          </span>
          <h2 className="mt-3 font-heading font-bold text-3xl md:text-5xl tracking-tight">
            Curated For You
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Hand-picked products that define the M4vx standard.
          </p>
        </motion.div>

        <div className="relative group/scroll">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, i) => (
              <div key={product.id} className="snap-start">
                <FeaturedProductCard product={product} index={i} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-background border border-border hidden md:flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-background border border-border hidden md:flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
