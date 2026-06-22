"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { createCoupon, toggleCoupon, deleteCoupon } from "@/server/actions/admin-actions"

interface AdminCouponsClientProps {
  coupons: {
    id: string
    code: string
    description: string
    discountType: string
    discountValue: number
    minOrderAmount: number | null
    maxUses: number | null
    usedCount: number
    isActive: boolean
    expiresAt: Date | null
  }[]
}

export function AdminCouponsClient({ coupons }: AdminCouponsClientProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const columns: Column<(typeof coupons)[0]>[] = [
    { key: "code", header: "Code", sortable: true, render: (value) => <span className="font-mono font-medium">{(value as string).toUpperCase()}</span> },
    {
      key: "discountType",
      header: "Type",
      render: (value) => (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto">
          {(value as string).charAt(0) + (value as string).slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "discountValue",
      header: "Value",
      sortable: true,
      render: (_, row) => (
        <span className="font-medium">
          {row.discountType === "PERCENTAGE" ? `${row.discountValue}%` : `$${row.discountValue}`}
        </span>
      ),
    },
    {
      key: "minOrderAmount",
      header: "Min Order",
      render: (value) => <span>{value ? `$${Number(value)}` : "—"}</span>,
    },
    {
      key: "usedCount",
      header: "Used",
      render: (_, row) => <span>{row.usedCount}{row.maxUses ? ` / ${row.maxUses}` : ""}</span>,
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">Never</span>
        const expired = new Date(value as Date) < new Date()
        return <span className={expired ? "text-destructive" : ""}>{new Date(value as Date).toLocaleDateString()}</span>
      },
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "outline"} className="text-[10px] px-1.5 py-0 h-auto">
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "Actions",
      width: "100px",
      render: (value, row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] h-7"
            onClick={async () => {
              await toggleCoupon(value as string, !row.isActive)
              router.refresh()
            }}
          >
            {row.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={async () => {
              if (confirm("Delete this coupon?")) {
                await deleteCoupon(value as string)
                router.refresh()
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm onSuccess={() => { setOpen(false); router.refresh() }} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        data={coupons}
        columns={columns}
        searchable={false}
        itemsPerPage={20}
      />
    </div>
  )
}

function CouponForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createCoupon(formData)
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" required placeholder="e.g. SUMMER20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountType">Type</Label>
          <Select name="discountType" required defaultValue="PERCENTAGE">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">Value</Label>
          <Input id="discountValue" name="discountValue" type="number" step="0.01" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
          <Input id="minOrderAmount" name="minOrderAmount" type="number" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxUses">Max Uses</Label>
          <Input id="maxUses" name="maxUses" type="number" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expires At</Label>
        <Input id="expiresAt" name="expiresAt" type="date" />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Coupon"}
      </Button>
    </form>
  )
}
