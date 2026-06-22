import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getPersonalizedRecommendations } from "@/server/services/recommendation-service"
import { DashboardOverview } from "@/components/account/dashboard-overview"

export const metadata = {
  title: "Account Dashboard",
  description: "Manage your account.",
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user!.id

  const [orders, wishlistCount, recommendations] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.wishlistItem.count({ where: { userId } }),
    getPersonalizedRecommendations(userId, 4),
  ])

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + Number(o.total), 0),
    wishlistCount,
  }

  const recentOrders = orders.slice(0, 3).map((o) => ({
    orderNumber: o.orderNumber,
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt,
  }))

  return (
    <DashboardOverview
      userName={session!.user!.name}
      stats={stats}
      recentOrders={recentOrders}
      recommendations={recommendations}
    />
  )
}
