"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { approveReview, rejectReview, deleteReview, bulkApproveReviews, bulkRejectReviews, bulkDeleteReviews } from "@/server/actions/admin-actions"
import { Check, X, Trash2 } from "lucide-react"

interface AdminReviewsClientProps {
  reviews: {
    id: string
    rating: number
    title: string
    body: string
    isApproved: boolean
    createdAt: Date
    user: { name: string; email: string }
    product: { name: string; slug: string }
  }[]
}

export function AdminReviewsClient({ reviews }: AdminReviewsClientProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const columns: Column<(typeof reviews)[0]>[] = [
    {
      key: "product",
      header: "Product",
      render: (value) => <span className="font-medium">{(value as { name: string }).name}</span>,
    },
    {
      key: "user",
      header: "Customer",
      render: (value) => {
        const u = value as { name: string; email: string }
        return <span>{u.name}</span>
      },
    },
    {
      key: "rating",
      header: "Rating",
      render: (value) => <span className="font-medium">{"★".repeat(value as number)}{"☆".repeat(5 - (value as number))}</span>,
    },
    {
      key: "body",
      header: "Review",
      render: (value) => <span className="text-muted-foreground text-sm line-clamp-2">{(value as string) || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (value) => <span className="text-muted-foreground text-xs">{formatDate(value as Date)}</span>,
    },
    {
      key: "isApproved",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "outline"} className="text-[10px] px-1.5 py-0 h-auto">
          {value ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "Actions",
      width: "140px",
      render: (value, row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {!row.isApproved && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={async () => { await approveReview(value as string); router.refresh() }}>
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          {row.isApproved && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={async () => { await rejectReview(value as string); router.refresh() }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={async () => { if (confirm("Delete review?")) { await deleteReview(value as string); router.refresh() } }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  async function handleBulkApprove() {
    await bulkApproveReviews(Array.from(selected))
    setSelected(new Set())
    router.refresh()
  }

  async function handleBulkReject() {
    await bulkRejectReviews(Array.from(selected))
    setSelected(new Set())
    router.refresh()
  }

  async function handleBulkDelete() {
    if (confirm(`Delete ${selected.size} reviews?`)) {
      await bulkDeleteReviews(Array.from(selected))
      setSelected(new Set())
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center gap-2 p-3 border border-border bg-muted/30">
          <span className="text-sm text-muted-foreground mr-2">{selected.size} selected</span>
          <Button variant="outline" size="sm" onClick={handleBulkApprove}>
            <Check className="h-3.5 w-3.5 mr-1" /> Approve
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkReject}>
            <X className="h-3.5 w-3.5 mr-1" /> Reject
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      )}
      <DataTable
        data={reviews}
        columns={columns}
        searchable={false}
        itemsPerPage={20}
        selection={{
          selected,
          onSelectionChange: setSelected,
          getId: (row) => row.id,
        }}
      />
    </div>
  )
}
