import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { OrderDetails } from "@/components/account/order-details"

export const metadata = {
  title: "Order Details",
  description: "View your order details.",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user!.id

  const order = await prisma.order.findUnique({
    where: { orderNumber: id },
    include: { items: true, shippingAddress: true },
  })

  if (!order || order.userId !== userId) {
    notFound()
  }

  return (
    <OrderDetails
      order={{
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        taxAmount: Number(order.taxAmount),
        discountAmount: Number(order.discountAmount),
        total: Number(order.total),
        shippingMethod: order.shippingMethod,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        email: order.email,
        items: order.items.map((i) => ({
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: order.shippingAddress
          ? {
              line1: order.shippingAddress.line1,
              line2: order.shippingAddress.line2,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              postalCode: order.shippingAddress.postalCode,
              country: order.shippingAddress.country,
              phone: order.shippingAddress.phone,
            }
          : null,
      }}
    />
  )
}
