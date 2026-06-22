import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructWebhookEvent } from "@/server/services/payment-service"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  try {
    const event = await constructWebhookEvent(body, signature)

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        await prisma.order.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
        })
        break
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        await prisma.order.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { paymentStatus: "FAILED" },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
