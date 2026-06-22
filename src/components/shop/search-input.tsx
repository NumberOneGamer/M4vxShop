"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { useCallback, useRef } from "react"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("search") ?? ""
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearch = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set("search", value)
        } else {
          params.delete("search")
        }
        params.set("page", "1")
        router.push(`?${params.toString()}`)
      }, 300)
    },
    [router, searchParams]
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        defaultValue={current}
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full h-9 pl-9 pr-8 text-sm bg-background border border-border placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
      />
      {current && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete("search")
            params.set("page", "1")
            router.push(`?${params.toString()}`)
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
