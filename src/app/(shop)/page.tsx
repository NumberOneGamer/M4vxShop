import { Suspense } from "react"
import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { BestSellersCarousel } from "@/components/home/best-sellers-carousel"
import { SocialProof } from "@/components/home/social-proof"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { OrganizationSchema } from "@/components/shared/seo/organization-schema"

export const metadata: Metadata = {
  title: "M4vx | Premium Dropshipping",
  description: "Premium products curated for modern lifestyles. Discover our curated collection of high-quality products across categories.",
  openGraph: {
    title: "M4vx | Premium Dropshipping",
    description: "Premium products curated for modern lifestyles. Discover our curated collection of high-quality products across categories.",
    url: "/",
    siteName: "M4vx",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "/" },
}

export const revalidate = 3600

function FeaturedProductsFallback() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <div className="h-3 w-16 bg-muted animate-pulse" />
          <div className="h-10 w-72 bg-muted animate-pulse" />
          <div className="h-5 w-96 bg-muted animate-pulse" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[350px] md:w-[480px] h-[240px] bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>
      <CategoriesGrid />
      <BestSellersCarousel />
      <Suspense fallback={null}>
        <SocialProof />
      </Suspense>
      <NewsletterSection />
    </>
  )
}
