"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getOrderByNumber } from "@/server/actions/order-actions"
import { OrderConfirmation } from "@/components/checkout/order-confirmation"

export function SuccessPageClient() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [order, setOrder] = useState<{
    orderNumber: string
    email: string
    total: number
    createdAt: Date
    shippingMethod: string | null
    items: { name: string; price: number; quantity: number; image?: string | null }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false)
      return
    }

    toast.success("Order confirmed!", {
      description: `Order #${orderNumber}`,
    })

    getOrderByNumber(orderNumber).then((data) => {
      if (data) {
        setOrder({
          orderNumber: data.orderNumber,
          email: data.email,
          total: Number(data.total),
          createdAt: data.createdAt,
          shippingMethod: data.shippingMethod,
          items: data.items.map((i) => ({
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            image: i.image,
          })),
        })
      }
      setLoading(false)
    })
  }, [orderNumber])

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading your order...</div>
  }

  if (!order || !orderNumber) {
    return (
      <div className="text-center text-muted-foreground">
        {!orderNumber ? "No order number found." : "Order not found."}
      </div>
    )
  }

  return <OrderConfirmation {...order} />
}
