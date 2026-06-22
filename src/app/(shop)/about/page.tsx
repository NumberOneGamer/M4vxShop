import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "M4vx curates premium products for modern lifestyles. Quality-driven, design-focused.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="bg-background py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About M4VX</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>M4vx is a premium dropshipping platform that curates high-quality products for modern lifestyles. We believe in design that speaks through simplicity — every product is selected for its quality, aesthetic, and functionality.</p>
          <p>Our collections span tech, accessories, home, lifestyle, and fitness. Each category is thoughtfully assembled to bring you the best of what modern manufacturing and design have to offer.</p>
          <p>We partner with reliable suppliers worldwide to ensure fast shipping and consistent quality. Every order is tracked and supported from placement to delivery.</p>
        </div>
      </div>
    </div>
  )
}
