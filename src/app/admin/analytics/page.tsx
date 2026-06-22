import { getRevenueData, getOrdersData, getPageViewsData, getTopProducts, getAdminStats } from "@/server/actions/admin-actions"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { OrdersChart } from "@/components/admin/orders-chart"
import { TopProductsTable } from "@/components/admin/top-products-table"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

export default async function AdminAnalyticsPage() {
  const [stats, revenueData, ordersData, pageViewsData, topProducts] = await Promise.all([
    getAdminStats(),
    getRevenueData(90),
    getOrdersData(90),
    getPageViewsData(90),
    getTopProducts(10),
  ])

  const totalViews = pageViewsData.reduce((sum, d) => sum + d.views, 0)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">90-day performance overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Page Views</p>
          <p className="text-2xl font-semibold mt-1">{totalViews.toLocaleString()}</p>
        </div>
        <div className="border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-semibold mt-1">{stats.ordersCount.toLocaleString()}</p>
        </div>
        <div className="border border-border p-5">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-semibold mt-1">{stats.conversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      <TopProductsTable products={topProducts} />

      <AdminMobileNav />
    </div>
  )
}
