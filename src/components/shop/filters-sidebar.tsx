"use client"

import { useState } from "react"
import { FilterAccordion } from "./filter-accordion"
import { PriceRangeSlider } from "./price-range-slider"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface FiltersSidebarProps {
  categories: Category[]
  minPrice: number
  maxPrice: number
}

const ratings = [4, 3, 2, 1]

export function FiltersSidebar({
  categories,
  minPrice,
  maxPrice,
}: FiltersSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")
  const currentMin = searchParams.get("minPrice")
  const currentMax = searchParams.get("maxPrice")
  const currentRating = searchParams.get("rating")

  const [priceOpen, setPriceOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(true)

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Filters
      </div>

      <FilterAccordion
        title="Category"
        open={categoryOpen}
        onToggle={() => setCategoryOpen(!categoryOpen)}
      >
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              setParam(
                "category",
                currentCategory === cat.slug ? null : cat.slug
              )
            }
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              currentCategory === cat.slug
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </FilterAccordion>

      <FilterAccordion
        title="Price"
        open={priceOpen}
        onToggle={() => setPriceOpen(!priceOpen)}
      >
        <PriceRangeSlider
          min={minPrice}
          max={maxPrice}
          value={[
            currentMin ? Number(currentMin) : minPrice,
            currentMax ? Number(currentMax) : maxPrice,
          ]}
          onChange={([min, max]) => {
            setParam("minPrice", min > minPrice ? String(min) : null)
            setParam("maxPrice", max < maxPrice ? String(max) : null)
          }}
        />
      </FilterAccordion>

      <FilterAccordion
        title="Rating"
        open={ratingOpen}
        onToggle={() => setRatingOpen(!ratingOpen)}
      >
        {ratings.map((r) => (
          <button
            key={r}
            onClick={() =>
              setParam("rating", currentRating === String(r) ? null : String(r))
            }
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              currentRating === String(r)
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="tracking-wider">
              {"★".repeat(r)}
              {"☆".repeat(5 - r)}
            </span>
            <span className="ml-1.5">& up</span>
          </button>
        ))}
      </FilterAccordion>
    </div>
  )
}
