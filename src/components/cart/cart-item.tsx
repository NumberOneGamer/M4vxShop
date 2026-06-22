"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { CartItemQuantity } from "./cart-item-quantity"
import type { CartItemType } from "@/types/cart"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex gap-4 p-4 border border-border"
    >
      <Link href={`/${item.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary border border-border overflow-hidden relative">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/${item.slug}`}
              className="text-sm font-medium hover:text-muted-foreground transition-colors truncate"
            >
              {item.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          {item.variantName && (
            <p className="text-xs text-muted-foreground">{item.variantName}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <CartItemQuantity
            quantity={item.quantity}
            stock={item.stock}
            onUpdate={(q) => onUpdateQuantity(item.id, q)}
          />
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            {item.comparePrice && item.comparePrice > item.price && (
              <p className="text-xs text-muted-foreground line-through">
                ${(item.comparePrice * item.quantity).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
