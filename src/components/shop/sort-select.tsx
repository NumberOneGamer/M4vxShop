"use client"

import { useRouter, useSearchParams } from "next/navigation"

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
]

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") ?? "newest"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="h-9 px-3 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 cursor-pointer"
      aria-label="Sort products"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
