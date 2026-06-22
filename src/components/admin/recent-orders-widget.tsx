"use client"

import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

interface RecentOrdersWidgetProps {
  orders: {
    id: string
    orderNumber: string
    email: string
    total: number
    status: string
    createdAt: Date
  }[]
}

export function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="border border-border"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Recent Orders</h3>
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="text-xs">View all</Button>
        </Link>
      </div>
      <div className="divide-y divide-border">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{order.orderNumber}</p>
              <p className="text-muted-foreground text-xs truncate">{order.email}</p>
            </div>
            <div className="text-right mr-3">
              <p className="font-medium">{formatPrice(order.total)}</p>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto capitalize">
                {order.status.toLowerCase()}
              </Badge>
            </div>
            <Link href={`/admin/orders/${order.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground text-center">No orders yet.</p>
        )}
      </div>
    </motion.div>
  )
}
