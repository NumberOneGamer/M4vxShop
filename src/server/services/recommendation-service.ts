import { prisma } from "@/lib/prisma"
import {
  scoreForCart,
  scoreForProduct,
  scoreTrending,
  scorePersonalized,
} from "./recommendation-engine"
import type { FeaturedProduct } from "@/types/product"
import type { CartItemType } from "@/types/cart"

async function toFeaturedProducts(
  productIds: string[],
  limit: number
): Promise<FeaturedProduct[]> {
  if (productIds.length === 0) return []

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
  })

  const productMap = new Map(products.map((p) => [p.id, p]))

  return productIds
    .map((id) => productMap.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt ?? p.name,
    }))
}

export async function getRecommendationsForCart(
  cartItems: CartItemType[],
  limit = 4
): Promise<FeaturedProduct[]> {
  try {
    if (cartItems.length === 0) return []

    const cartProductIds = cartItems.map((i) => i.productId)

    const cartProducts = await prisma.product.findMany({
      where: { id: { in: cartProductIds } },
      include: {
        categories: { select: { categoryId: true } },
      },
    })

    const categoryIds = [
      ...new Set(cartProducts.flatMap((p) => p.categories.map((c) => c.categoryId))),
    ]

    if (categoryIds.length === 0) return []

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)

    const candidates = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: cartProductIds },
        categories: {
          some: { categoryId: { in: categoryIds } },
        },
      },
      include: {
        categories: { select: { categoryId: true } },
        _count: {
          select: {
            orderItems: true,
            pageViews: { where: { timestamp: { gte: thirtyDaysAgo } } },
          },
        },
      },
      take: 50,
    })

    const signals = candidates.map((p) => ({
      productId: p.id,
      categoryIds: p.categories.map((c) => c.categoryId),
      viewCount: p._count.pageViews,
      orderCount: p._count.orderItems,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      stock: p.stock,
      createdAt: p.createdAt,
    }))

    const scored = scoreForCart(signals, {
      categoryIds,
      productIds: cartProductIds,
    })

    const sorted = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.productId)

    return toFeaturedProducts(sorted, limit)
  } catch {
    return []
  }
}

export async function getRecommendationsForProduct(
  productId: string,
  limit = 4
): Promise<FeaturedProduct[]> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: { select: { categoryId: true } },
      },
    })

    if (!product) return []

    const categoryIds = product.categories.map((c) => c.categoryId)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)

    const candidates = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: productId },
        OR: [
          { categories: { some: { categoryId: { in: categoryIds } } } },
          { isBestSeller: true },
        ],
      },
      include: {
        categories: { select: { categoryId: true } },
        _count: {
          select: {
            orderItems: true,
            pageViews: { where: { timestamp: { gte: thirtyDaysAgo } } },
          },
        },
      },
      take: 50,
    })

    const signals = candidates.map((p) => ({
      productId: p.id,
      categoryIds: p.categories.map((c) => c.categoryId),
      viewCount: p._count.pageViews,
      orderCount: p._count.orderItems,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      stock: p.stock,
      createdAt: p.createdAt,
    }))

    const tags: string[] = []
    if (product.material) tags.push(product.material.toLowerCase())
    if (product.dimensions) tags.push(product.dimensions.toLowerCase())

    const scored = scoreForProduct(signals, {
      productId,
      categoryIds,
      tags,
    })

    const sorted = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.productId)

    return toFeaturedProducts(sorted, limit)
  } catch {
    return []
  }
}

export async function getTrendingProducts(limit = 8): Promise<FeaturedProduct[]> {
  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

    const candidates = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        categories: { select: { categoryId: true } },
        _count: {
          select: {
            orderItems: true,
            pageViews: { where: { timestamp: { gte: sevenDaysAgo } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const signals = candidates.map((p) => ({
      productId: p.id,
      categoryIds: p.categories.map((c) => c.categoryId),
      viewCount: p._count.pageViews,
      orderCount: p._count.orderItems,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      stock: p.stock,
      createdAt: p.createdAt,
    }))

    const scored = scoreTrending(signals)

    const sorted = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.productId)

    return toFeaturedProducts(sorted, limit)
  } catch {
    return []
  }
}

export async function getPersonalizedRecommendations(
  userId: string,
  limit = 4
): Promise<FeaturedProduct[]> {
  try {
    const [orders, wishlist, views] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: { select: { productId: true } } },
      }),
      prisma.wishlistItem.findMany({
        where: { userId },
        select: { productId: true },
      }),
      prisma.productView.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 20,
        select: { productId: true },
      }),
    ])

    const orderProductIds = [
      ...new Set(orders.flatMap((o) => o.items.map((i) => i.productId))),
    ]
    const wishlistProductIds = wishlist.map((w) => w.productId)
    const viewedProductIds = [...new Set(views.map((v) => v.productId))]

    const excludeIds = [...new Set([...orderProductIds, ...viewedProductIds.slice(0, 10)])]

    const allCategoryIds = [...new Set([...orderProductIds, ...wishlistProductIds])]

    const categoryPrefs =
      allCategoryIds.length > 0
        ? await prisma.productCategory.findMany({
            where: { productId: { in: allCategoryIds } },
            select: { categoryId: true },
          })
        : []

    const preferredCategoryIds = [
      ...new Set(categoryPrefs.map((cp) => cp.categoryId)),
    ]

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)

    const whereBase: Record<string, unknown> = { isActive: true }
    if (excludeIds.length > 0) {
      whereBase.id = { notIn: excludeIds }
    }

    const candidates = await prisma.product.findMany({
      where: {
        ...whereBase,
        OR:
          preferredCategoryIds.length > 0
            ? [
                { categories: { some: { categoryId: { in: preferredCategoryIds } } } },
                { isBestSeller: true },
              ]
            : undefined,
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      include: {
        categories: { select: { categoryId: true } },
        _count: {
          select: {
            orderItems: true,
            pageViews: { where: { timestamp: { gte: thirtyDaysAgo } } },
          },
        },
      },
      take: 50,
    })

    const signals = candidates.map((p) => ({
      productId: p.id,
      categoryIds: p.categories.map((c) => c.categoryId),
      viewCount: p._count.pageViews,
      orderCount: p._count.orderItems,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      stock: p.stock,
      createdAt: p.createdAt,
    }))

    const scored = scorePersonalized(signals, {
      orderProductIds,
      wishlistProductIds,
      viewedProductIds,
      preferredCategoryIds,
    })

    const sorted = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.productId)

    return toFeaturedProducts(sorted, limit)
  } catch {
    return []
  }
}
