import type { Metadata } from "next"
import { FaqItem } from "@/components/product/faq-item"

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about M4vx shipping, returns, and orders.",
  alternates: { canonical: "/faqs" },
}

const FAQS = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-10 business days. Express shipping is available at checkout for 2-4 business day delivery." },
  { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Refunds are processed within 5-7 business days after we receive the return." },
  { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination and are calculated at checkout." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All payments are processed securely through Stripe." },
]

export default function FaqsPage() {
  return (
    <div className="bg-background py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">FAQs</h1>
        <p className="text-muted-foreground mb-12">Answers to commonly asked questions about ordering, shipping, and returns.</p>
        <div className="border-t border-border">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  )
}
