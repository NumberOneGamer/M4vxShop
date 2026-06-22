"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

export function ActiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: { key: string; label: string }[] = []

  const search = searchParams.get("search")
  if (search) filters.push({ key: "search", label: `"${search}"` })

  const category = searchParams.get("category")
  if (category) filters.push({ key: "category", label: category })

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  if (minPrice || maxPrice) {
    filters.push({
      key: "price",
      label: `$${minPrice ?? "0"}–$${maxPrice ?? "∞"}`,
    })
  }

  const rating = searchParams.get("rating")
  if (rating) filters.push({ key: "rating", label: `${rating}★ & up` })

  if (filters.length === 0) return null

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === "price") {
      params.delete("minPrice")
      params.delete("maxPrice")
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  function clearAll() {
    router.push("?")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Active filters:</span>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => removeFilter(f.key)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border hover:bg-secondary transition-colors"
        >
          {f.label}
          <X className="h-2.5 w-2.5" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
      >
        Clear all
      </button>
    </div>
  )
}
