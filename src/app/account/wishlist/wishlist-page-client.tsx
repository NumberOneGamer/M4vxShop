"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WishlistGrid } from "@/components/account/wishlist-grid"
import { removeFromWishlist } from "@/server/actions/wishlist-actions"

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string | null
  slug: string
}

interface WishlistPageClientProps {
  items: WishlistItem[]
  userId: string
}

export function WishlistPageClient({ items: initialItems, userId }: WishlistPageClientProps) {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRemove = async (productId: string) => {
    setLoading(true)
    await removeFromWishlist(userId, productId)
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    setLoading(false)
    router.refresh()
  }

  return <WishlistGrid items={items} onRemove={handleRemove} loading={loading} />
}
