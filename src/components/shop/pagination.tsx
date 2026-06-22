"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              "w-8 h-8 text-xs border border-border transition-colors",
              p === currentPage
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-secondary"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center border border-border disabled:opacity-30 hover:bg-secondary transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </nav>
  )
}
