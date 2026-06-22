import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Container } from "@/components/layout/container"
import { CheckoutPageClient } from "./checkout-page-client"

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
  robots: { index: false, follow: false },
}

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">Checkout</h1>
        <CheckoutPageClient user={session?.user ?? null} />
      </Container>
    </div>
  )
}
