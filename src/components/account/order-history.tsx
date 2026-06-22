"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"

interface OrderItem {
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: Date
}

interface OrderHistoryProps {
  orders: OrderItem[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statuses = ["all", ...new Set(orders.map((o) => o.status))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage your orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium border border-border transition-colors whitespace-nowrap ${
                statusFilter === s ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-secondary"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="border border-border">
          <div className="hidden sm:grid grid-cols-5 gap-4 p-3 text-xs font-medium text-muted-foreground uppercase border-b border-border">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Payment</span>
            <span className="text-right">Total</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/account/orders/${order.orderNumber}`}
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 text-sm hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium sm:font-normal">{order.orderNumber}</span>
                <span className="text-muted-foreground sm:text-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="capitalize">{order.status.toLowerCase()}</span>
                <span className="capitalize text-muted-foreground">{order.paymentStatus.toLowerCase()}</span>
                <span className="text-right font-medium">{formatPrice(order.total)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found.</p>
          {search && (
            <button onClick={() => setSearch("")} className="text-sm underline mt-2">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}
