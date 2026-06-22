import { getStripe } from "@/lib/stripe"

export async function createPaymentIntent(amount: number, currency = "usd") {
  const intent = await getStripe().paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  })
  return intent
}

export async function retrievePaymentIntent(id: string) {
  return getStripe().paymentIntents.retrieve(id)
}

export async function confirmPaymentIntent(id: string) {
  return getStripe().paymentIntents.confirm(id)
}

export async function cancelPaymentIntent(id: string) {
  return getStripe().paymentIntents.cancel(id)
}

export async function constructWebhookEvent(payload: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ""
  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret)
}

export async function createExpressCheckoutSession(items: {
  name: string
  price: number
  quantity: number
  image?: string | null
}[]) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : undefined,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    payment_method_types: ["card"],
    success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/checkout`,
  })

  return session
}
