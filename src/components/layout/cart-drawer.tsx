"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Trash2, Sparkles } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import { CartItemQuantity } from "@/components/cart/cart-item-quantity"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import type { FeaturedProduct } from "@/types/product"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCartStore()
  const [recommendations, setRecommendations] = useState<FeaturedProduct[]>([])
  const dialogRef = useFocusTrap(open)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open && items.length > 0) {
      const productIds = items.map((i) => i.productId)
      fetch("/api/recommendations/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      })
        .then((r) => r.json())
        .then((data) => setRecommendations(data.products ?? []))
        .catch(() => setRecommendations([]))
    } else {
      setRecommendations([])
    }
  }, [open, items])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isEmpty = items.length === 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                <span className="font-medium" aria-live="polite" aria-atomic="true">Cart ({totalItems()})</span>
              </div>
              <button ref={closeRef} onClick={onClose} className="p-2 -mr-2" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" strokeWidth={1.5} />
                  <p className="text-muted-foreground mb-6">Your cart is empty</p>
                  <Button asChild variant="outline" onClick={onClose} className="rounded-none">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border border-border">
                      <Link href={`/${item.slug}`} className="flex-shrink-0" onClick={onClose}>
                        <div className="w-16 h-16 bg-secondary border border-border overflow-hidden relative">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.imageAlt ?? item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                              No image
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/${item.slug}`}
                            onClick={onClose}
                            className="text-sm font-medium truncate hover:text-muted-foreground transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-0.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <CartItemQuantity
                            quantity={item.quantity}
                            stock={item.stock}
                            onUpdate={(q) => updateQuantity(item.id, q)}
                          />
                          <span className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isEmpty && recommendations.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-muted-foreground">Complete Your Look</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {recommendations.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={`/${product.slug}`}
                      onClick={onClose}
                      className="flex-shrink-0 w-20 group"
                    >
                      <div className="aspect-square border border-border bg-secondary overflow-hidden mb-1 relative">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.imageAlt ?? product.name}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                            No image
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] truncate text-muted-foreground group-hover:text-foreground transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[10px] font-medium">${product.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isEmpty && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal())}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <Button asChild className="w-full rounded-none text-sm h-11" onClick={onClose}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-none text-sm h-11" onClick={onClose}>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
