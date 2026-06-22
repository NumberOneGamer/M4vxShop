"use client"

import { useState } from "react"
import { SearchInput } from "./search-input"
import { SortSelect } from "./sort-select"
import { ActiveFilters } from "./active-filters"
import { ProductGrid } from "./product-grid"
import { Pagination } from "./pagination"
import { EmptySearchResults } from "./empty-search-results"
import { FiltersSidebar } from "./filters-sidebar"
import { MobileFilterDrawer } from "./mobile-filter-drawer"
import { SlidersHorizontal } from "lucide-react"
import type { ShopProduct } from "@/types/shop"
import type { Category } from "@/types/category"

interface ShopListingClientProps {
  products: ShopProduct[]
  totalCount: number
  totalPages: number
  currentPage: number
  categories: Category[]
  minPrice: number
  maxPrice: number
  search?: string
}

export function ShopListingClient({
  products,
  totalCount,
  totalPages,
  currentPage,
  categories,
  minPrice,
  maxPrice,
  search,
}: ShopListingClientProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Shop
        </h1>
        <p className="text-sm text-muted-foreground mt-1" aria-live="polite" aria-atomic="true">
          {totalCount} product{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <SearchInput />
        </div>
        <SortSelect />
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden h-9 px-3 border border-border flex items-center gap-2 text-sm hover:bg-secondary transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      <ActiveFilters />

      <div className="flex gap-8 mt-6">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FiltersSidebar
              categories={categories}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <EmptySearchResults search={search} />
          ) : (
            <>
              <ProductGrid products={products} />
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  )
}
