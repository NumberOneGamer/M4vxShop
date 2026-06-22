import { getCustomers } from "@/server/actions/admin-actions"
import { AdminCustomersClient } from "./admin-customers-client"

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const { customers, total } = await getCustomers({
    search: params.search,
    page: Number(params.page) || 1,
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} customers total</p>
      </div>
      <AdminCustomersClient
        customers={customers.map((c) => ({ id: c.id, name: c.name, email: c.email, image: c.image, role: c.role, createdAt: c.createdAt, totalSpent: c.totalSpent, _count: c._count }))}
      />
    </div>
  )
}
