"use client"

import { CreditCard, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <p className="text-muted-foreground mt-1">Manage your saved payment methods.</p>
      </div>

      <div className="border border-border p-8 text-center space-y-4">
        <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/30" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods securely through Stripe.
          </p>
        </div>
        <Button variant="outline" className="rounded-none gap-2" asChild>
          <a
            href="https://dashboard.stripe.com/settings"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            Manage in Stripe Dashboard
          </a>
        </Button>
      </div>
    </div>
  )
}
