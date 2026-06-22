import { Suspense } from "react"
import { Container } from "@/components/layout/container"
import { SuccessPageClient } from "./success-page-client"

export const metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully.",
  robots: { index: false, follow: false },
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-20">
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <SuccessPageClient />
        </Suspense>
      </Container>
    </div>
  )
}
