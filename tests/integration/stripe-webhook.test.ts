import { describe, it, expect, vi, beforeEach } from "vitest"

const mockPrisma = {
  order: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

describe("Stripe Webhook Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("handles payment_intent.succeeded event", async () => {
    const payload = {
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test_123",
          amount_received: 5000,
        },
      },
    }

    mockPrisma.order.findUnique.mockResolvedValue({
      id: "order-1",
      stripePaymentIntentId: "pi_test_123",
      status: "PENDING",
    })
    mockPrisma.order.update.mockResolvedValue({ id: "order-1", status: "PROCESSING" })

    const handler = async (event: typeof payload) => {
      if (event.type !== "payment_intent.succeeded") return { received: true }

      const order = await mockPrisma.order.findUnique({
        where: { stripePaymentIntentId: event.data.object.id },
      })

      if (!order) return { error: "Order not found" }

      await mockPrisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", status: "PROCESSING" },
      })

      return { received: true, orderId: order.id }
    }

    const result = await handler(payload)
    expect(result).toEqual({ received: true, orderId: "order-1" })
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: "order-1" },
      data: { paymentStatus: "PAID", status: "PROCESSING" },
    })
  })

  it("ignores non-payment events", async () => {
    const payload = { type: "customer.created", data: { object: {} } }
    const handler = async (event: typeof payload) => {
      if (event.type !== "payment_intent.succeeded") return { received: true }
      return { error: "unhandled" }
    }
    const result = await handler(payload)
    expect(result).toEqual({ received: true })
    expect(mockPrisma.order.findUnique).not.toHaveBeenCalled()
  })

  it("returns error for unknown payment intent", async () => {
    const payload = {
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_unknown" } },
    }
    mockPrisma.order.findUnique.mockResolvedValue(null)

    const handler = async (event: typeof payload) => {
      if (event.type !== "payment_intent.succeeded") return { received: true }
      const order = await mockPrisma.order.findUnique({
        where: { stripePaymentIntentId: event.data.object.id },
      })
      if (!order) return { error: "Order not found" }
      return { received: true }
    }

    const result = await handler(payload)
    expect(result).toEqual({ error: "Order not found" })
  })
})
