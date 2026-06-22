"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { FeaturedProduct } from "@/types/product"

interface RecentlyViewedProps {
  currentSlug: string
}

export function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const [items, setItems] = useState<FeaturedProduct[]>([])
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("recently-viewed")
      if (stored) {
        const parsed: FeaturedProduct[] = JSON.parse(stored)
        setItems(parsed.filter((item) => item.slug !== currentSlug).slice(0, 6))
      }
    } catch {
      // ignore
    }
  }, [currentSlug])

  if (items.length === 0) return null

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">
            Recently Viewed
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-none">
          {items.map((product) => (
            <motion.button
              key={product.id}
              type="button"
              onClick={() => router.push(`/${product.slug}`)}
              className="flex-shrink-0 w-[160px] sm:w-[180px] text-left group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aspect-square border border-border bg-secondary overflow-hidden mb-2 relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.imageAlt ?? product.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <h3 className="text-xs font-medium truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                ${product.price.toFixed(2)}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
