import { Suspense } from "react"
import { StatsShowcase } from "./stats-showcase"
import { TestimonialsScroll } from "./testimonials-scroll"
import { TrustBadges } from "./trust-badges"

export function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <StatsShowcase />
      </Suspense>

      <div className="py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Loved by thousands
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Real reviews from real customers
          </p>
        </div>
        <Suspense fallback={null}>
          <TestimonialsScroll />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <TrustBadges />
      </Suspense>
    </section>
  )
}
