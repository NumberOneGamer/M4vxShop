"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/shared/price-display"
import { cn } from "@/lib/utils"

interface StickyBuyBarProps {
  name: string
  price: number
  comparePrice: number | null
  stock: number
}

export function StickyBuyBar({ name, price, comparePrice, stock }: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const inStock = stock > 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    )

    const sentinel = document.getElementById("sticky-buy-bar-sentinel")
    if (sentinel) observer.observe(sentinel)

    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed bottom-14 md:bottom-0 left-0 right-0 z-40",
            "border-t border-border bg-background/95 backdrop-blur-md"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <PriceDisplay price={price} comparePrice={comparePrice} size="sm" />
              </div>

              <div className="flex items-center gap-3 flex-1 sm:flex-none justify-end">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center border border-border hover:border-muted-foreground/50 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <Button
                  disabled={!inStock}
                  className="rounded-none gap-2 text-xs h-10 px-6"
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
