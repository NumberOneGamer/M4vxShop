export const revalidate = 3600

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { searchProducts } from "@/server/actions/product-actions"
import { ShopListingClient } from "@/components/shop/shop-listing-client"
import type { ShopFilters } from "@/types/shop"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our curated collection of premium products. Find the perfect item for your lifestyle.",
  alternates: { canonical: "/shop" },
}

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    })
  } catch {
    return []
  }
}

async function getPriceRange() {
  try {
    const agg = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
      where: { isActive: true },
    })
    return {
      min: Number(agg._min.price ?? 0),
      max: Number(agg._max.price ?? 1000),
    }
  } catch {
    return { min: 0, max: 1000 }
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams

  const filters: ShopFilters = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    minPrice: typeof sp.minPrice === "string" ? Number(sp.minPrice) : undefined,
    maxPrice: typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined,
    rating: typeof sp.rating === "string" ? Number(sp.rating) : undefined,
    sort: (typeof sp.sort === "string"
      ? sp.sort
      : "newest") as ShopFilters["sort"],
    page: typeof sp.page === "string" ? Number(sp.page) : 1,
  }

  const [result, categories, priceRange] = await Promise.all([
    searchProducts(filters),
    getCategories(),
    getPriceRange(),
  ])

  return (
    <ShopListingClient
      products={result.products}
      totalCount={result.totalCount}
      totalPages={result.totalPages}
      currentPage={result.currentPage}
      categories={categories}
      minPrice={priceRange.min}
      maxPrice={priceRange.max}
      search={filters.search}
    />
  )
}
