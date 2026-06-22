"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const couponValidationSchema = z.object({
  code: z.string().min(1).max(50),
  subtotal: z.number().min(0),
})

export async function validateCoupon(code: string, subtotal: number) {
  const parsed = couponValidationSchema.safeParse({ code, subtotal })
  if (!parsed.success) {
    return { valid: false, error: "Invalid coupon code" }
  }
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: parsed.data.code.toUpperCase() },
    })

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code" }
    }

    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is no longer active" }
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, error: "This coupon has expired" }
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: "This coupon has reached its usage limit" }
    }

    if (coupon.minOrderAmount && parsed.data.subtotal < Number(coupon.minOrderAmount)) {
      return {
        valid: false,
        error: `Minimum order amount of $${Number(coupon.minOrderAmount).toFixed(2)} required`,
      }
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType as "percentage" | "fixed",
        discountValue: Number(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
      },
    }
  } catch {
    return { valid: false, error: "Failed to validate coupon" }
  }
}
