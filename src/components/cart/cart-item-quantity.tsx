"use client"

import { Minus, Plus } from "lucide-react"

interface CartItemQuantityProps {
  quantity: number
  stock: number
  onUpdate: (quantity: number) => void
}

export function CartItemQuantity({ quantity, stock, onUpdate }: CartItemQuantityProps) {
  return (
    <div className="flex items-center border border-border">
      <button
        type="button"
        onClick={() => onUpdate(quantity - 1)}
        disabled={quantity <= 1}
        className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5 md:w-3 md:h-3" strokeWidth={1.5} />
      </button>
      <span className="w-10 md:w-8 text-center text-xs font-medium tabular-nums select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(quantity + 1)}
        disabled={quantity >= stock}
        className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5 md:w-3 md:h-3" strokeWidth={1.5} />
      </button>
    </div>
  )
}
