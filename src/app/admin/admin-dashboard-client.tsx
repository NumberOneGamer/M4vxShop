import { getAdminStats, getRecentOrders, getTopProducts, getRevenueData, getOrdersData } from "@/server/actions/admin-actions"
import { AdminOverview } from "@/components/admin/admin-overview"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { OrdersChart } from "@/components/admin/orders-chart"
import { ConversionChart } from "@/components/admin/conversion-chart"
import { RecentOrdersWidget } from "@/components/admin/recent-orders-widget"
import { TopProductsTable } from "@/components/admin/top-products-table"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

export default async function AdminDashboardClient() {
  const [stats, recentOrders, topProducts, revenueData, ordersData] = await Promise.all([
    getAdminStats(),
    getRecentOrders(5),
    getTopProducts(5),
    getRevenueData(30),
    getOrdersData(30),
  ])

  const totalOrders30 = ordersData.reduce((sum, d) => sum + d.orders, 0)
  const totalRevenue30 = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const conversionRate =
    totalOrders30 > 0
      ? ((totalOrders30 / (stats.activeProducts || 1)) * 100).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Store overview and recent activity.
        </p>
      </div>

      <AdminOverview
        stats={{
          totalRevenue: stats.totalRevenue,
          ordersCount: stats.ordersCount,
          customersCount: stats.customersCount,
          activeProducts: stats.activeProducts,
          recentRevenue: totalRevenue30,
          recentOrders: totalOrders30,
          conversionRate,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      <ConversionChart rate={conversionRate} totalViews={stats.activeProducts} totalOrders={totalOrders30} />

      <RecentOrdersWidget
        orders={recentOrders.map((o) => ({ ...o, total: Number(o.total) }))}
      />

      <TopProductsTable products={topProducts} />

      <AdminMobileNav />
    </div>
  )
}
