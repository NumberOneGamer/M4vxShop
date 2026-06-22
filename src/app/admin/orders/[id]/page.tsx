import { notFound } from "next/navigation"
import { getOrderById } from "@/server/actions/admin-actions"
import { AdminOrderDetail } from "./admin-order-detail"

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  return <AdminOrderDetail order={order} />
}
