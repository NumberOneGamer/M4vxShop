"use client"

import { DataTable, type Column } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatPrice } from "@/lib/utils"

interface AdminCustomersClientProps {
  customers: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
    createdAt: Date
    totalSpent: number
    _count: { orders: number }
  }[]
}

export function AdminCustomersClient({ customers }: AdminCustomersClientProps) {
  const columns: Column<(typeof customers)[0]>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
            {(row.name ?? row.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{row.name ?? "Unnamed"}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <Badge variant={value === "ADMIN" ? "default" : "outline"} className="text-[10px] px-1.5 py-0 h-auto capitalize">
          {(value as string).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "_count",
      header: "Orders",
      render: (value) => <span>{(value as { orders: number }).orders}</span>,
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      sortable: true,
      render: (value) => <span className="font-medium">{formatPrice(value as number)}</span>,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (value) => <span className="text-muted-foreground">{formatDate(value as Date)}</span>,
    },
  ]

  return (
    <DataTable
      data={customers}
      columns={columns}
      searchPlaceholder="Search customers..."
      itemsPerPage={20}
    />
  )
}
