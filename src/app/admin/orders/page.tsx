import type { Metadata } from "next"
import { getOrders } from "@/server/actions/admin-actions"
import { AdminOrdersClient } from "./admin-orders-client"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage customer orders.",
  robots: { index: false, follow: false },
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const { orders, total } = await getOrders({
    search: params.search,
    status: params.status,
    page: Number(params.page) || 1,
    limit: 20,
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} orders total</p>
      </div>
      <AdminOrdersClient
        orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          email: o.email,
          total: Number(o.total),
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
          itemsCount: o.items.length,
          customerName: o.user?.name ?? null,
        }))}
      />
    </div>
  )
}
