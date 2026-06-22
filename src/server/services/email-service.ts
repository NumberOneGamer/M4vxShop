import { sendEmail } from "@/lib/email/send"
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation"
import { ShippingUpdateEmail } from "@/lib/email/templates/shipping-update"
import { WelcomeEmail } from "@/lib/email/templates/welcome"
import { PasswordResetEmail } from "@/lib/email/templates/password-reset"
import { AbandonedCartEmail } from "@/lib/email/templates/abandoned-cart"
import { getBaseUrl } from "@/lib/metadata"
import { prisma } from "@/lib/prisma"

interface OrderItemData {
  name: string
  price: number
  quantity: number
  image?: string | null
}

interface ShippingAddressData {
  line1: string
  line2?: string | null
  city: string
  state?: string | null
  postalCode: string
  country: string
}

export async function sendOrderConfirmation(params: {
  email: string
  customerName: string
  orderNumber: string
  items: OrderItemData[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  shippingAddress: ShippingAddressData
  estimatedDelivery?: string
}) {
  return sendEmail({
    to: params.email,
    subject: `Order #${params.orderNumber} — Confirmed`,
    react: OrderConfirmationEmail({
      ...params,
      estimatedDelivery: params.estimatedDelivery ?? "5-7 business days",
    }),
  })
}

export async function sendShippingUpdate(params: {
  email: string
  customerName: string
  orderNumber: string
  status: string
  trackingNumber?: string | null
  trackingUrl?: string | null
  carrier?: string | null
}) {
  return sendEmail({
    to: params.email,
    subject: `Order #${params.orderNumber} — ${params.status.toLowerCase()}`,
    react: ShippingUpdateEmail(params),
  })
}

export async function sendWelcomeEmail(params: {
  email: string
  customerName: string
  discountCode?: string
  discountPercentage?: number
}) {
  return sendEmail({
    to: params.email,
    subject: "Welcome to M4VX",
    react: WelcomeEmail(params),
  })
}

export async function sendPasswordReset(params: {
  email: string
  customerName: string
  resetLink: string
}) {
  return sendEmail({
    to: params.email,
    subject: "Reset your M4VX password",
    react: PasswordResetEmail(params),
  })
}

export async function sendAbandonedCart(params: {
  email: string
  customerName: string
  items: OrderItemData[]
  cartTotal: number
}) {
  const cartLink = `${getBaseUrl()}/cart`
  return sendEmail({
    to: params.email,
    subject: "Your cart is waiting",
    react: AbandonedCartEmail({ ...params, cartLink }),
  })
}

export async function triggerAbandonedCartReminders() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const carts = await prisma.cart.findMany({
    where: {
      updatedAt: { lte: twentyFourHoursAgo },
      abandonedEmailSent: false,
      userId: { not: null },
      items: { some: {} },
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: {
            select: { name: true, price: true, images: { take: 1, select: { url: true } } },
          },
        },
      },
    },
  })

  const results: { email: string; success: boolean }[] = []

  for (const cart of carts) {
    if (!cart.user?.email) continue

    const items = cart.items.map((item) => ({
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.images[0]?.url ?? null,
    }))

    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const result = await sendAbandonedCart({
      email: cart.user.email,
      customerName: cart.user.name ?? "there",
      items,
      cartTotal,
    })

    if (result.success) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { abandonedEmailSent: true },
      })
    }

    results.push({ email: cart.user.email, success: result.success })
  }

  return { sent: results.filter((r) => r.success).length, total: results.length }
}
