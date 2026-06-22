"use client"

import { motion } from "framer-motion"

interface AdminOverviewProps {
  stats: {
    totalRevenue: number
    ordersCount: number
    customersCount: number
    activeProducts: number
    recentRevenue: number
    recentOrders: number
    conversionRate: string
  }
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

  const cards = [
    { title: "Total Revenue", value: formatCurrency(Number(stats.totalRevenue)), trend: `$${Number(stats.recentRevenue).toLocaleString()} this month` },
    { title: "Orders", value: stats.ordersCount.toLocaleString(), trend: `${stats.recentOrders} this month` },
    { title: "Customers", value: stats.customersCount.toLocaleString() },
    { title: "Active Products", value: stats.activeProducts.toLocaleString() },
    { title: "Conversion Rate", value: `${stats.conversionRate}%` },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store performance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-border p-5 space-y-2"
          >
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
            {card.trend && (
              <p className="text-xs text-muted-foreground">{card.trend}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
