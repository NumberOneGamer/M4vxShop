"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { Category } from "@/types/category"
import { FiltersSidebar } from "./filters-sidebar"

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  minPrice: number
  maxPrice: number
}

export function MobileFilterDrawer({
  open,
  onClose,
  categories,
  minPrice,
  maxPrice,
}: MobileFilterDrawerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          >
            <div className="sticky top-0 bg-background border-b border-border px-4 h-14 flex items-center justify-between z-10">
              <span className="text-sm font-medium">Filters</span>
              <button onClick={onClose} aria-label="Close filters">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <FiltersSidebar
                categories={categories}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
