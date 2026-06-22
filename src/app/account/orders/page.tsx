import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { OrderHistory } from "@/components/account/order-history"

export const metadata = {
  title: "Order History",
  description: "View your order history.",
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user!.id

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <OrderHistory
      orders={orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: Number(o.total),
        createdAt: o.createdAt,
      }))}
    />
  )
}
