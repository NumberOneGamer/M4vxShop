import type { Metadata } from "next"
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ShopListingClient } from "@/components/shop/shop-listing-client"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Search",
  description: "Search results for products on M4vx.",
  robots: { index: false, follow: true },
}

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 48

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q.trim() : ""

  if (!q) {
    return <ShopListingClient products={[]} totalCount={0} totalPages={0} currentPage={1} categories={[]} minPrice={0} maxPrice={1000} />
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { select: { rating: true } },
        categories: { include: { category: { select: { slug: true, name: true } } }, take: 1 },
      },
      take: PAGE_SIZE,
    }),
    prisma.product.count({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
    }),
  ])

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    image: p.images[0]?.url ?? null,
    imageAlt: p.images[0]?.alt ?? p.name,
    averageRating: p.reviews.length > 0 ? Math.round((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length) * 10) / 10 : 0,
    reviewCount: p.reviews.length,
    isNew: p.isNew,
    categories: p.categories.map((c) => ({ slug: c.category.slug, name: c.category.name })),
  }))

  return (
    <ShopListingClient
      products={mapped}
      totalCount={totalCount}
      totalPages={Math.ceil(totalCount / PAGE_SIZE)}
      currentPage={1}
      categories={[]}
      minPrice={0}
      maxPrice={1000}
      search={q}
    />
  )
}

function SearchFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults searchParams={props.searchParams} />
    </Suspense>
  )
}
