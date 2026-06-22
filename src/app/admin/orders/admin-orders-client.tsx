"use client"

import { DataTable, type Column } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"
import Link from "next/link"

interface AdminOrdersClientProps {
  orders: {
    id: string
    orderNumber: string
    email: string
    total: number
    status: string
    paymentStatus: string
    createdAt: Date
    itemsCount: number
    customerName: string | null
  }[]
}

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  PROCESSING: "bg-foreground text-background",
  SHIPPED: "bg-foreground text-background",
  DELIVERED: "bg-foreground text-background",
  CANCELLED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
}

export function AdminOrdersClient({ orders }: AdminOrdersClientProps) {

  const columns: Column<(typeof orders)[0]>[] = [
    {
      key: "orderNumber",
      header: "Order",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.orderNumber}</p>
          <p className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (_, row) => (
        <div>
          <p className="text-sm">{row.customerName || "Guest"}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "itemsCount",
      header: "Items",
      render: (value) => <span>{String(value)}</span>,
    },
    {
      key: "total",
      header: "Total",
      sortable: true,
      render: (value) => <span className="font-medium">{formatPrice(value as number)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge className={`text-[10px] px-1.5 py-0.5 h-auto rounded-sm ${statusColors[value as string] ?? ""}`}>
          {(value as string).charAt(0) + (value as string).slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (value) => (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto capitalize">
          {(value as string).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "",
      width: "60px",
      render: (value) => (
        <Link href={`/admin/orders/${value}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchPlaceholder="Search by order number or email..."
      itemsPerPage={20}
    />
  )
}
