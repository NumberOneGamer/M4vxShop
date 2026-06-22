"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface CheckoutSummaryProps {
  items: { name: string; price: number; quantity: number; image?: string | null; variantName?: string | null }[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
}

export function CheckoutSummary({
  items,
  subtotal,
  shippingCost,
  taxAmount,
  discountAmount,
  total,
}: CheckoutSummaryProps) {
  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-14 h-14 bg-secondary border border-border flex-shrink-0 overflow-hidden relative">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                  No img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {item.variantName && (
                <p className="text-xs text-muted-foreground">{item.variantName}</p>
              )}
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span className="text-green-600">-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{shippingCost > 0 ? formatPrice(shippingCost) : "Free"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        <Separator className="my-1.5" />
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
