"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { updateOrderStatus, updateOrderTracking } from "@/server/actions/admin-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AdminOrderDetailProps {
  order: {
    id: string
    orderNumber: string
    email: string
    status: string
    paymentStatus: string
    subtotal: number
    shippingCost: number
    taxAmount: number
    discountAmount: number
    total: number
    currency: string
    shippingMethod: string | null
    trackingNumber: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    user: { name: string | null; email: string } | null
    items: {
      id: string
      name: string
      price: number
      quantity: number
      image: string | null
      product: { name: string; images: { url: string }[] } | null
    }[]
    shippingAddress: {
      line1: string
      line2: string | null
      city: string
      state: string | null
      postalCode: string
      country: string
    } | null
    coupon: { code: string } | null
  }
}

export function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const router = useRouter()
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(n)

  async function handleStatusChange(status: string) {
    await updateOrderStatus(order.id, status)
    router.refresh()
  }

  async function handleTrackingSubmit(formData: FormData) {
    const tracking = formData.get("tracking") as string
    if (tracking) {
      await updateOrderTracking(order.id, tracking)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Order Items</h3>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden shrink-0 relative">
                    <Image
                      src={item.image ?? item.product?.images[0]?.url ?? ""}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatCurrency(Number(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Shipping Address</h3>
            </div>
            <div className="p-4 text-sm">
              {order.shippingAddress ? (
                <div className="space-y-1 text-muted-foreground">
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}
                    {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address</p>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Notes</h3>
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                {order.notes}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Summary</h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(Number(order.taxAmount))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-destructive">-{formatCurrency(Number(order.discountAmount))}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
              {order.coupon && (
                <p className="text-xs text-muted-foreground pt-1">Coupon: {order.coupon.code}</p>
              )}
            </div>
          </div>

          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Customer</h3>
            </div>
            <div className="p-4 text-sm">
              {order.user ? (
                <div className="space-y-1">
                  <p className="font-medium">{order.user.name ?? "No name"}</p>
                  <p className="text-muted-foreground">{order.user.email}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">Guest</p>
                  <p className="text-muted-foreground">{order.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Order Status</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <form action={handleTrackingSubmit} className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    name="tracking"
                    defaultValue={order.trackingNumber ?? ""}
                    placeholder="Add tracking..."
                  />
                  <Button type="submit" size="sm">Save</Button>
                </div>
              </form>

              <div className="flex gap-2 text-xs text-muted-foreground pt-2">
                <Badge variant="outline" className="text-[10px] capitalize">
                  Payment: {order.paymentStatus.toLowerCase()}
                </Badge>
                {order.shippingMethod && (
                  <Badge variant="outline" className="text-[10px]">
                    {order.shippingMethod}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
