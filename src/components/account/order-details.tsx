"use client"

import Image from "next/image"
import { formatPrice, formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { OrderTimeline } from "./order-timeline"

interface OrderDetailsProps {
  order: {
    orderNumber: string
    status: string
    paymentStatus: string
    subtotal: number
    shippingCost: number
    taxAmount: number
    discountAmount: number
    total: number
    shippingMethod: string | null
    trackingNumber: string | null
    createdAt: Date
    email: string
    items: {
      name: string
      price: number
      quantity: number
      image: string | null
    }[]
    shippingAddress: {
      line1: string
      line2: string | null
      city: string
      state: string | null
      postalCode: string
      country: string
      phone: string | null
    } | null
  }
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const getTimelineSteps = () => {
    const steps = [
      { name: "Order Placed", timestamp: formatDate(order.createdAt), isCompleted: true },
      { name: "Processing", timestamp: "", isCompleted: order.status !== "PENDING" },
      { name: "Shipped", timestamp: "", isCompleted: order.status === "SHIPPED" || order.status === "DELIVERED" },
      { name: "Delivered", timestamp: "", isCompleted: order.status === "DELIVERED" },
    ]
    return steps
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium border ${
            order.status === "DELIVERED" ? "border-green-600 text-green-600" :
            order.status === "CANCELLED" ? "border-destructive text-destructive" :
            "border-foreground text-foreground"
          }`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 text-xs font-medium border ${
            order.paymentStatus === "PAID" ? "border-green-600 text-green-600" :
            "border-muted-foreground text-muted-foreground"
          }`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <OrderTimeline steps={getTimelineSteps()} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="border border-border divide-y divide-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 p-3">
                {item.image && (
                  <div className="w-14 h-14 bg-secondary border border-border flex-shrink-0 overflow-hidden relative">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {order.shippingAddress && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
              <div className="border border-border p-3 text-sm space-y-1">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="text-muted-foreground">{order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="border border-border p-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : "Free"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <Separator className="my-1.5" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
