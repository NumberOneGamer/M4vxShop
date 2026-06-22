"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { Container } from "@/components/layout/container"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CartItem } from "@/components/cart/cart-item"
import { CartEmptyState } from "@/components/cart/cart-empty-state"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartRecommendations } from "@/components/cart/cart-recommendations"

export function CartPageClient() {
  const {
    items,
    subtotal,
    discount,
    shippingCost,
    total,
    totalItems,
    coupon,
    shipping,
    updateQuantity,
    removeItem,
    setCoupon,
    setShipping,
  } = useCartStore()

  const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
          ]}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          Shopping Cart
          {!isEmpty && (
            <span className="text-lg text-muted-foreground font-normal ml-2">
              ({totalItems()} items)
            </span>
          )}
        </h1>

        {isEmpty ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                  Continue Shopping
                </Link>
              </motion.div>

              <CartRecommendations productIds={items.map((i) => i.productId)} />
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal()}
                discount={discount()}
                shippingCost={shippingCost()}
                total={total()}
                coupon={coupon}
                shipping={shipping}
                itemCount={totalItems()}
                onApplyCoupon={setCoupon}
                onRemoveCoupon={() => setCoupon(null)}
                onSelectShipping={setShipping}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
