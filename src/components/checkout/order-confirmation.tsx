"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface OrderConfirmationProps {
  orderNumber: string
  email: string
  total: number
  createdAt: Date
  items: { name: string; price: number; quantity: number; image?: string | null }[]
  shippingMethod?: string | null
}

export function OrderConfirmation({
  orderNumber,
  email,
  total,
  createdAt,
  items,
  shippingMethod,
}: OrderConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground text-background mb-6"
      >
        <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
      </motion.div>

      <h1 className="text-2xl font-semibold mb-2">Order Confirmed</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase! A confirmation email has been sent to{" "}
        <span className="text-foreground">{email}</span>.
      </p>

      <div className="border border-border divide-y divide-border text-left">
        <div className="p-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Order Number</span>
          <span className="font-medium">{orderNumber}</span>
        </div>
        <div className="p-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formatDate(createdAt)}</span>
        </div>
        {shippingMethod && (
          <div className="p-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium capitalize">{shippingMethod}</span>
          </div>
        )}
      </div>

      <div className="border-x border-b border-border divide-y divide-border text-left mt-6">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 p-4">
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

      <div className="border border-t-0 border-border p-4 flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="mt-8 space-y-3">
        <Button asChild className="w-full rounded-none">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-none">
          <Link href="/account/orders">View Order Status</Link>
        </Button>
      </div>
    </motion.div>
  )
}
