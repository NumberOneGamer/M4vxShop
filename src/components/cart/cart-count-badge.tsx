"use client"

import { useCartStore } from "@/stores/cart-store"

export function CartCountBadge() {
  const items = useCartStore((s) => s.items)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full"
    >
      {count > 0 ? (count > 99 ? "99+" : count) : null}
    </span>
  )
}
