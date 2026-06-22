import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the M4vx team. We're here to help.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <div className="bg-background py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contact</h1>
        <p className="text-muted-foreground mb-12">Have a question or need help? Send us an email and we&apos;ll get back to you within 24 hours.</p>
        <div className="space-y-6">
          <div className="border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Email</h2>
            <p className="text-foreground">support@m4vx.com</p>
          </div>
          <div className="border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Response Time</h2>
            <p className="text-foreground">We typically respond within 24 hours during business days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
