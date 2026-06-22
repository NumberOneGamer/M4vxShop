"use server"

import { prisma } from "@/lib/prisma"

export async function getWishlistItems(userId: string) {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      image: item.product.images[0]?.url ?? null,
      slug: item.product.slug,
    }))
  } catch {
    return []
  }
}

export async function addToWishlist(userId: string, productId: string) {
  try {
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) return { success: true }
    await prisma.wishlistItem.create({ data: { userId, productId } })
    return { success: true }
  } catch {
    return { error: "Failed to add to wishlist" }
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  try {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    })
    return { success: true }
  } catch {
    return { error: "Failed to remove from wishlist" }
  }
}
