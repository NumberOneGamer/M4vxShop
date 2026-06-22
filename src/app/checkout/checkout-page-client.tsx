"use client"

import { useState } from "react"
import { useCartStore } from "@/stores/cart-store"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { GuestCheckout } from "@/components/checkout/guest-checkout"
import { CartEmptyState } from "@/components/cart/cart-empty-state"

interface CheckoutPageClientProps {
  user: { id: string; email: string; name?: string | null } | null
}

export function CheckoutPageClient({ user }: CheckoutPageClientProps) {
  const { items } = useCartStore()
  const [guestEmail, setGuestEmail] = useState<string | null>(null)

  const isEmpty = items.length === 0
  const canProceed = !!user || !!guestEmail

  if (isEmpty) {
    return <CartEmptyState />
  }

  if (!canProceed) {
    return (
      <div className="max-w-md mx-auto">
        <GuestCheckout onContinue={(email) => setGuestEmail(email)} />
      </div>
    )
  }

  return <CheckoutForm />
}
