"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import type { ShippingFormData } from "./shipping-form"

interface ReviewFormProps {
  shippingData: ShippingFormData
  cartItems: { name: string; price: number; quantity: number; image?: string | null; variantName?: string | null }[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  loading?: boolean
  onBack: () => void
  onConfirm: () => void
}

export function ReviewForm({
  shippingData,
  cartItems,
  subtotal,
  shippingCost,
  taxAmount,
  discountAmount,
  total,
  loading,
  onBack,
  onConfirm,
}: ReviewFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Contact</h3>
        <p className="text-sm text-muted-foreground">{shippingData.email}</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Shipping Address</h3>
        <p className="text-sm text-muted-foreground">
          {shippingData.firstName} {shippingData.lastName}
          <br />
          {shippingData.address1}
          {shippingData.address2 && <>, {shippingData.address2}</>}
          <br />
          {shippingData.city}, {shippingData.state} {shippingData.postalCode}
          {shippingData.phone && <><br />{shippingData.phone}</>}
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Shipping Method</h3>
        <p className="text-sm text-muted-foreground capitalize">{shippingData.shippingMethod}</p>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Items</h3>
        <div className="space-y-2">
          {cartItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {item.image && (
                  <div className="w-10 h-10 bg-secondary border border-border flex-shrink-0 overflow-hidden relative">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                )}
                <span className="truncate">
                  {item.name}
                  {item.variantName && <span className="text-muted-foreground"> ({item.variantName})</span>}
                  <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                </span>
              </div>
              <span className="font-medium flex-shrink-0 ml-4">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
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

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 rounded-none">
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={loading} className="flex-1 rounded-none">
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  )
}
