"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { useFocusTrap } from "@/hooks/use-focus-trap"
interface SearchCommandProps {
  open: boolean
  onClose: () => void
}

const TRENDING = [
  "Wireless headphones",
  "Smart watch",
  "Gaming accessories",
  "Minimalist backpack",
  "Fitness tracker",
]

export function SearchCommand({ open, onClose }: SearchCommandProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useFocusTrap(open)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery("")
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleTrendingClick = (term: string) => {
    setQuery(term)
    router.push(`/shop/search?q=${encodeURIComponent(term)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white z-50 shadow-2xl rounded-sm overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex items-center border-b" role="search">
              <Search className="h-4 w-4 text-muted-foreground ml-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="flex-1 px-3 py-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-2 mr-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 mr-4 text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm">
                ESC
              </kbd>
            </form>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trending
                </span>
              </div>
              <div className="space-y-1">
                {TRENDING.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="flex items-center justify-between w-full px-2 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary rounded-sm transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{term}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
