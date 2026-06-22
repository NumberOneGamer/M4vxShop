"use client"

import { useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { getStripePublishableKey } from "@/lib/stripe-client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const stripePromise = loadStripe(getStripePublishableKey())

interface PaymentFormWrapperProps {
  clientSecret: string
  onSuccess: () => void
  onBack: () => void
}

export function PaymentFormWrapper({ clientSecret, onSuccess, onBack }: PaymentFormWrapperProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#000000",
        colorBackground: "#ffffff",
        colorText: "#000000",
        colorDanger: "#dc2626",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "0px",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}

function PaymentFormInner({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? "Validation failed")
      setLoading(false)
      return
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (result.error) {
      setError(result.error.message ?? "Payment failed")
      setLoading(false)
      return
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess()
    } else {
      setError("Payment requires additional processing")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment</h2>
        <p className="text-sm text-muted-foreground mb-4">
          All transactions are secure and encrypted.
        </p>
        <div className="p-4 border border-border">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 rounded-none">
          Back
        </Button>
        <Button type="submit" disabled={!stripe || loading} className="flex-1 rounded-none">
          {loading ? <Spinner className="mr-2" /> : null}
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  )
}
