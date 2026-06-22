import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string | null
  slug: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.find((i) => i.productId === item.productId)) return
        set({ items: [...get().items, item] })
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },
      isInWishlist: (productId) => {
        return !!get().items.find((i) => i.productId === productId)
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "m4vx-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
