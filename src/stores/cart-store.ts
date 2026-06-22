import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItemType, CartCoupon, CartShippingOption } from "@/types/cart"

interface CartStore {
  items: CartItemType[]
  coupon: CartCoupon | null
  shipping: CartShippingOption | null
  isOpen: boolean

  addItem: (item: CartItemType) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCoupon: (coupon: CartCoupon | null) => void
  setShipping: (shipping: CartShippingOption | null) => void
  setOpen: (open: boolean) => void
  toggleOpen: () => void

  totalItems: () => number
  subtotal: () => number
  discount: () => number
  shippingCost: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shipping: null,
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [], coupon: null, shipping: null })
      },

      setCoupon: (coupon) => set({ coupon }),
      setShipping: (shipping) => set({ shipping }),
      setOpen: (open) => set({ isOpen: open }),
      toggleOpen: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      discount: () => {
        const { coupon, subtotal } = get()
        if (!coupon) return 0
        if (coupon.minOrderAmount && subtotal() < coupon.minOrderAmount) return 0
        return coupon.discountType === "percentage"
          ? subtotal() * (coupon.discountValue / 100)
          : coupon.discountValue
      },
      shippingCost: () => get().shipping?.cost ?? 0,
      total: () => {
        const s = get().subtotal()
        const d = get().discount()
        const sh = get().shippingCost()
        return Math.max(0, s - d + sh)
      },
    }),
    {
      name: "m4vx-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shipping: state.shipping,
      }),
    }
  )
)
