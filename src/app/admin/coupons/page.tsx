import { getCoupons } from "@/server/actions/admin-actions"
import { AdminCouponsClient } from "./admin-coupons-client"

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const { coupons, total } = await getCoupons({
    page: Number(params.page) || 1,
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} coupons total</p>
        </div>
      </div>
      <AdminCouponsClient
        coupons={coupons.map((c) => ({
          id: c.id,
          code: c.code,
          description: c.description ?? "",
          discountType: c.discountType,
          discountValue: Number(c.discountValue),
          minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
          maxUses: c.maxUses ?? null,
          usedCount: c.usedCount,
          isActive: c.isActive,
          expiresAt: c.expiresAt ?? null,
        }))}
      />
    </div>
  )
}
