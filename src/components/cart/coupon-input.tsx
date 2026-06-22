"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { validateCoupon } from "@/server/actions/coupon-actions"
import type { CartCoupon } from "@/types/cart"

interface CouponInputProps {
  onApply: (coupon: CartCoupon) => void
  onRemove: () => void
  appliedCoupon: CartCoupon | null
}

export function CouponInput({ onApply, onRemove, appliedCoupon }: CouponInputProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)

    const result = await validateCoupon(code.trim(), 0)

    if (result.valid && result.coupon) {
      onApply(result.coupon)
      setCode("")
    } else {
      setError(result.error ?? "Invalid coupon")
    }

    setLoading(false)
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between px-3 py-2 border border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium">{appliedCoupon.code}</span>
          <span className="text-xs text-muted-foreground">
            {appliedCoupon.discountType === "percentage"
              ? `${appliedCoupon.discountValue}% off`
              : `-$${appliedCoupon.discountValue.toFixed(2)}`}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Remove coupon"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Coupon Code</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError(null)
          }}
          placeholder="Enter code"
          className={cn(
            "rounded-none text-sm h-10 flex-1",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
        <Button
          onClick={handleApply}
          disabled={!code.trim() || loading}
          className="rounded-none text-sm h-10 px-5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-xs text-destructive"
          >
            <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
