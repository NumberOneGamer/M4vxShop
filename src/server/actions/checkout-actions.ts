"use server"

import { prisma } from "@/lib/prisma"
import { createPaymentIntent } from "@/server/services/payment-service"
import { generateOrderNumber } from "@/lib/utils"
import { createOrderSchema } from "@/lib/validations"
import { sendOrderConfirmation } from "@/server/services/email-service"

export interface CreatePaymentIntentInput {
  items: { name: string; price: number; quantity: number; image?: string | null }[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
}

export async function createCheckoutPaymentIntent(input: CreatePaymentIntentInput) {
  try {
    const intent = await createPaymentIntent(input.total)
    return { clientSecret: intent.client_secret, paymentIntentId: intent.id }
  } catch {
    return { error: "Failed to create payment intent" }
  }
}

export async function createOrder(formData: {
  email: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  shippingMethod: string
  notes?: string
  paymentIntentId: string
  items: { productId: string; variantId?: string | null; name: string; price: number; quantity: number; image?: string | null }[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  couponId?: string
  userId?: string
}) {
  const parsed = createOrderSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: "Invalid order data" }
  }
  try {
    const orderNumber = generateOrderNumber()

    const data: Record<string, unknown> = {
      orderNumber,
      email: formData.email,
      subtotal: formData.subtotal,
      shippingCost: formData.shippingCost,
      taxAmount: formData.taxAmount,
      discountAmount: formData.discountAmount,
      total: formData.total,
      shippingMethod: formData.shippingMethod,
      notes: formData.notes,
      stripePaymentIntentId: formData.paymentIntentId,
      couponId: formData.couponId,
      items: {
        create: formData.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
        })),
      },
    }

    if (formData.userId) {
      data.userId = formData.userId
      data.shippingAddress = {
        create: {
          userId: formData.userId,
          line1: formData.address1,
          line2: formData.address2 ?? "",
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone ?? "",
        },
      }
    }

    const order = await prisma.order.create({
      data: data as never,
      include: { items: true, shippingAddress: true },
    })

    if (formData.couponId) {
      await prisma.coupon.update({
        where: { id: formData.couponId },
        data: { usedCount: { increment: 1 } },
      })
    }

    sendOrderConfirmation({
      email: formData.email,
      customerName: `${formData.firstName} ${formData.lastName}`,
      orderNumber: order.orderNumber,
      items: formData.items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal: formData.subtotal,
      shippingCost: formData.shippingCost,
      taxAmount: formData.taxAmount,
      discountAmount: formData.discountAmount,
      total: formData.total,
      shippingAddress: {
        line1: formData.address1,
        line2: formData.address2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    })

    return { success: true, orderId: order.id, orderNumber: order.orderNumber }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { error: "Failed to create order" }
  }
}

export async function getOrderByPaymentIntent(paymentIntentId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { items: true, shippingAddress: true },
    })
    return order
  } catch {
    return null
  }
}
