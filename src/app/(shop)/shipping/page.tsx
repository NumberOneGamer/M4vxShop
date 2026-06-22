import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "M4vx shipping policy, delivery times, and return instructions.",
  alternates: { canonical: "/shipping" },
}

export default function ShippingPage() {
  return (
    <div className="bg-background py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Shipping & Returns</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">Shipping</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Orders are processed within 1-2 business days after payment confirmation.</p>
              <p>Standard shipping takes 5-10 business days. Express shipping takes 2-4 business days.</p>
              <p>Shipping costs are calculated at checkout based on your location and selected method.</p>
              <p>All orders include tracking information sent via email once the package ships.</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-3">Returns</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>We accept returns within 30 days of delivery for unused items in original packaging.</p>
              <p>To initiate a return, contact us at support@m4vx.com with your order number.</p>
              <p>Refunds are processed within 5-7 business days after we receive and inspect the return.</p>
              <p>Customers are responsible for return shipping costs unless the item arrived damaged or incorrect.</p>
            </div>
          </section>
          <p className="text-sm text-muted-foreground">Need help? <Link href="/contact" className="text-foreground underline underline-offset-4 hover:no-underline">Contact our support team</Link>.</p>
        </div>
      </div>
    </div>
  )
}
