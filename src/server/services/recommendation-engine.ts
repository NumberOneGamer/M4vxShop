export interface ScoredProduct {
  productId: string
  score: number
  reason: string
}

export interface CartContext {
  categoryIds: string[]
  productIds: string[]
}

export interface ProductContext {
  productId: string
  categoryIds: string[]
  tags: string[]
}

export interface UserContext {
  orderProductIds: string[]
  wishlistProductIds: string[]
  viewedProductIds: string[]
  preferredCategoryIds: string[]
}

interface ProductSignal {
  productId: string
  categoryIds: string[]
  viewCount: number
  orderCount: number
  isNew: boolean
  isBestSeller: boolean
  stock: number
  createdAt: Date
}

const WEIGHTS = {
  SAME_CATEGORY: 30,
  RELATED_CATEGORY: 15,
  VIEW_COUNT: 10,
  ORDER_COUNT: 25,
  IS_NEW: 5,
  IS_BEST_SELLER: 15,
  RECENCY: 10,
  IN_STOCK: 10,
  USER_ORDER_HISTORY: 20,
  USER_WISHLIST: 25,
  USER_VIEWED: 10,
  USER_PREFERRED_CATEGORY: 15,
  PENALTY_ALREADY_OWNED: -100,
}

export function scoreForCart(
  candidates: ProductSignal[],
  context: CartContext
): ScoredProduct[] {
  return candidates.map((p) => {
    let score = 0
    const reasons: string[] = []

    const sharedCategories = p.categoryIds.filter((c) =>
      context.categoryIds.includes(c)
    )
    if (sharedCategories.length > 0) {
      score += WEIGHTS.SAME_CATEGORY * sharedCategories.length
      reasons.push("same category")
    }

    score += Math.min(p.viewCount, 100) * (WEIGHTS.VIEW_COUNT / 100)
    score += Math.min(p.orderCount, 50) * (WEIGHTS.ORDER_COUNT / 50)

    if (p.isBestSeller) {
      score += WEIGHTS.IS_BEST_SELLER
      reasons.push("best seller")
    }
    if (p.isNew) {
      score += WEIGHTS.IS_NEW
      reasons.push("new arrival")
    }
    if (p.stock > 0) {
      score += WEIGHTS.IN_STOCK
    }

    const daysOld = (Date.now() - p.createdAt.getTime()) / 86400000
    if (daysOld < 30) {
      score += WEIGHTS.RECENCY
      reasons.push("recently added")
    }

    if (context.productIds.includes(p.productId)) {
      score += WEIGHTS.PENALTY_ALREADY_OWNED
    }

    return {
      productId: p.productId,
      score: Math.max(0, score),
      reason: reasons.slice(0, 2).join(", ") || "trending",
    }
  })
}

export function scoreForProduct(
  candidates: ProductSignal[],
  context: ProductContext
): ScoredProduct[] {
  return candidates.map((p) => {
    let score = 0
    const reasons: string[] = []

    if (p.productId === context.productId) {
      return { productId: p.productId, score: -1, reason: "self" }
    }

    const sharedCategories = p.categoryIds.filter((c) =>
      context.categoryIds.includes(c)
    )
    if (sharedCategories.length > 0) {
      score += WEIGHTS.SAME_CATEGORY * sharedCategories.length
      reasons.push("related category")
    }

    score += Math.min(p.orderCount, 100) * (WEIGHTS.ORDER_COUNT / 100)
    score += Math.min(p.viewCount, 100) * (WEIGHTS.VIEW_COUNT / 100)

    if (p.isBestSeller) {
      score += WEIGHTS.IS_BEST_SELLER
      reasons.push("popular")
    }
    if (p.stock > 0) {
      score += WEIGHTS.IN_STOCK
    }

    const daysOld = (Date.now() - p.createdAt.getTime()) / 86400000
    if (daysOld < 30) {
      score += WEIGHTS.RECENCY
    }

    return {
      productId: p.productId,
      score: Math.max(0, score),
      reason: reasons.slice(0, 2).join(", ") || "suggestion",
    }
  })
}

export function scoreTrending(
  candidates: ProductSignal[]
): ScoredProduct[] {
  return candidates.map((p) => {
    let score = 0
    const reasons: string[] = []

    score += Math.min(p.viewCount, 200) * (WEIGHTS.VIEW_COUNT / 200)
    score += Math.min(p.orderCount, 100) * (WEIGHTS.ORDER_COUNT / 100)

    if (p.isBestSeller) {
      score += WEIGHTS.IS_BEST_SELLER
      reasons.push("best seller")
    }
    if (p.isNew) {
      score += WEIGHTS.IS_NEW
      reasons.push("new")
    }

    const daysOld = (Date.now() - p.createdAt.getTime()) / 86400000
    if (daysOld < 7) {
      score += WEIGHTS.RECENCY * 2
      reasons.push("hot this week")
    } else if (daysOld < 30) {
      score += WEIGHTS.RECENCY
      reasons.push("recent")
    }

    if (p.stock > 0) {
      score += WEIGHTS.IN_STOCK
    }

    return {
      productId: p.productId,
      score: Math.max(0, score),
      reason: reasons.slice(0, 2).join(", ") || "trending",
    }
  })
}

export function scorePersonalized(
  candidates: ProductSignal[],
  context: UserContext
): ScoredProduct[] {
  return candidates.map((p) => {
    let score = 0
    const reasons: string[] = []

    if (context.orderProductIds.includes(p.productId)) {
      score += WEIGHTS.PENALTY_ALREADY_OWNED
    }

    const preferredMatches = p.categoryIds.filter((c) =>
      context.preferredCategoryIds.includes(c)
    )
    if (preferredMatches.length > 0) {
      score += WEIGHTS.USER_PREFERRED_CATEGORY * preferredMatches.length
      reasons.push("based on your preferences")
    }

    if (context.wishlistProductIds.includes(p.productId)) {
      score += WEIGHTS.USER_WISHLIST
      reasons.push("in your wishlist")
    }

    if (context.viewedProductIds.includes(p.productId)) {
      score += WEIGHTS.USER_VIEWED
      reasons.push("viewed recently")
    }

    score += Math.min(p.viewCount, 100) * (WEIGHTS.VIEW_COUNT / 100)
    score += Math.min(p.orderCount, 50) * (WEIGHTS.ORDER_COUNT / 50)

    if (p.isBestSeller) {
      score += WEIGHTS.IS_BEST_SELLER
      if (reasons.length === 0) reasons.push("popular choice")
    }
    if (p.isNew && reasons.length === 0) {
      score += WEIGHTS.IS_NEW
      reasons.push("new arrival")
    }
    if (p.stock > 0) {
      score += WEIGHTS.IN_STOCK
    }

    return {
      productId: p.productId,
      score: Math.max(0, score),
      reason: reasons.slice(0, 2).join(", ") || "suggested for you",
    }
  })
}
