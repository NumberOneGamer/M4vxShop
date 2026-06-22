import { Suspense } from "react"
import { getBestSellers } from "@/server/actions/product-actions"
import { BestSellersCarouselClient } from "./best-sellers-carousel-client"

async function BestSellersCarouselContent() {
  const products = await getBestSellers()
  return <BestSellersCarouselClient products={products} />
}

function BestSellersCarouselFallback() {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <div className="h-3 w-24 bg-muted animate-pulse" />
          <div className="h-10 w-56 bg-muted animate-pulse" />
          <div className="h-5 w-72 bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="h-4 w-3/4 bg-muted animate-pulse" />
              <div className="h-3 w-1/2 bg-muted animate-pulse" />
              <div className="h-4 w-1/3 bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BestSellersCarousel() {
  return (
    <Suspense fallback={<BestSellersCarouselFallback />}>
      <BestSellersCarouselContent />
    </Suspense>
  )
}
