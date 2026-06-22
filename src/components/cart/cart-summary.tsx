"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CouponInput } from "./coupon-input"
import { ShippingCalculator } from "./shipping-calculator"
import type { CartCoupon, CartShippingOption } from "@/types/cart"

interface CartSummaryProps {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  coupon: CartCoupon | null
  shipping: CartShippingOption | null
  itemCount: number
  onApplyCoupon: (coupon: CartCoupon) => void
  onRemoveCoupon: () => void
  onSelectShipping: (option: CartShippingOption) => void
}

export function CartSummary({
  subtotal,
  discount,
  shippingCost,
  total,
  coupon,
  shipping,
  itemCount,
  onApplyCoupon,
  onRemoveCoupon,
  onSelectShipping,
}: CartSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-border p-6 space-y-5 sticky top-24"
    >
      <h2 className="text-sm font-semibold tracking-tight">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium tabular-nums">
            {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-foreground">
            <span>Discount</span>
            <span className="font-medium tabular-nums">-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-base">
        <span className="font-semibold">Total</span>
        <span className="font-semibold tabular-nums">${total.toFixed(2)}</span>
      </div>

      <Button className="w-full rounded-none text-sm h-12">
        Proceed to Checkout
      </Button>

      <Separator />

      <CouponInput onApply={onApplyCoupon} onRemove={onRemoveCoupon} appliedCoupon={coupon} />

      <ShippingCalculator
        subtotal={subtotal}
        selected={shipping}
        onSelect={onSelectShipping}
      />
    </motion.div>
  )
}
