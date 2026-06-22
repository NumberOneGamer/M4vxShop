import { prisma } from "@/lib/prisma"
import type { ShopFilters, ShopProduct, ShopSearchResult } from "@/types/shop"

const SHOP_PAGE_SIZE = 12

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  accessories: ["accessory", "accessories", "strap", "case", "cover", "protector", "stand", "holder", "mount"],
  audio: ["audio", "speaker", "headphone", "earphone", "earbud", "microphone", "sound", "music"],
  clothing: ["clothing", "cloth", "apparel", "wear", "shirt", "jacket", "hoodie", "pant", "short", "dress"],
  electronics: ["electronic", "gadget", "device", "charger", "cable", "adapter", "hub", "dock", "battery"],
  gaming: ["gaming", "game", "controller", "console", "mouse", "keyboard", "headset"],
  home: ["home", "decor", "lighting", "lamp", "furniture", "organizer", "shelf"],
  bags: ["bag", "backpack", "tote", "pouch", "wallet", "carry"],
}

const COLOR_KEYWORDS: Record<string, string[]> = {
  black: ["black", "dark"],
  white: ["white", "light"],
  gray: ["gray", "grey", "silver"],
  red: ["red", "crimson", "scarlet"],
  blue: ["blue", "navy", "indigo"],
  green: ["green", "olive", "emerald"],
  brown: ["brown", "tan", "camel", "beige"],
}

const TAG_KEYWORDS: Record<string, string[]> = {
  new: ["new", "latest", "just released", "fresh"],
  sale: ["sale", "discount", "cheap", "budget", "deal", "offer", "bargain"],
  premium: ["premium", "luxury", "high-end", "deluxe", "pro"],
  eco: ["eco", "eco-friendly", "sustainable", "organic", "green", "recycled"],
  wireless: ["wireless", "bluetooth", "wifi", "cordless"],
  waterproof: ["waterproof", "water resistant", "weatherproof", "rain"],
  portable: ["portable", "compact", "travel", "on-the-go", "mobile"],
}

export interface ParsedQuery {
  keywords: string
  categorySlug?: string
  color?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
}

const PRICE_PATTERNS = [
  { regex: /under\s+\$?(\d+)/i, type: "max" as const },
  { regex: /above\s+\$?(\d+)/i, type: "min" as const },
  { regex: /over\s+\$?(\d+)/i, type: "min" as const },
  { regex: /under\s+(\d+)\s*dollars/i, type: "max" as const },
  { regex: /less\s+than\s+\$?(\d+)/i, type: "max" as const },
  { regex: /more\s+than\s+\$?(\d+)/i, type: "min" as const },
  { regex: /between\s+\$?(\d+)\s*(?:and|-)\s*\$?(\d+)/i, type: "range" as const },
  { regex: /\$?(\d+)\s*(?:to|-)\s*\$?(\d+)/i, type: "range" as const },
]

export function parseSearchQuery(raw: string): ParsedQuery {
  const query = raw.trim().toLowerCase()
  let keywords = raw.trim()
  let categorySlug: string | undefined
  let color: string | undefined
  const tags: string[] = []
  let minPrice: number | undefined
  let maxPrice: number | undefined

  for (const [slug, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const match = words.find((w) => {
      const pattern = new RegExp(`\\b${w}\\b`, "i")
      return pattern.test(query)
    })
    if (match) {
      categorySlug = slug
      keywords = keywords.replace(new RegExp(match, "gi"), "").trim()
      break
    }
  }

  for (const [colorName, words] of Object.entries(COLOR_KEYWORDS)) {
    const match = words.find((w) => {
      const pattern = new RegExp(`\\b${w}\\b`, "i")
      return pattern.test(query)
    })
    if (match) {
      color = colorName
      keywords = keywords.replace(new RegExp(match, "gi"), "").trim()
      break
    }
  }

  for (const [tag, words] of Object.entries(TAG_KEYWORDS)) {
    const match = words.find((w) => {
      const pattern = new RegExp(`\\b${w}\\b`, "i")
      return pattern.test(query)
    })
    if (match) {
      tags.push(tag)
      keywords = keywords.replace(new RegExp(match, "gi"), "").trim()
    }
  }

  for (const pattern of PRICE_PATTERNS) {
    const match = query.match(pattern.regex)
    if (match) {
      if (pattern.type === "max") {
        maxPrice = Number(match[1])
      } else if (pattern.type === "min") {
        minPrice = Number(match[1])
      } else if (pattern.type === "range") {
        minPrice = Number(match[1])
        maxPrice = Number(match[2])
      }
      keywords = keywords.replace(match[0], "").trim()
    }
  }

  return {
    keywords: keywords.replace(/\s+/g, " ").trim(),
    categorySlug,
    color,
    tags: tags.length > 0 ? tags : undefined,
    minPrice,
    maxPrice,
  }
}

export function buildShopFilters(parsed: ParsedQuery): ShopFilters {
  const filters: ShopFilters = { sort: "newest", page: 1 }

  if (parsed.keywords) {
    filters.search = parsed.keywords
  }

  if (parsed.categorySlug) {
    filters.category = parsed.categorySlug
  }

  if (parsed.color) {
    const colorTerms = COLOR_KEYWORDS[parsed.color]?.[0] ?? parsed.color
    const existingSearch = filters.search ?? ""
    filters.search = existingSearch
      ? `${existingSearch} ${colorTerms}`
      : colorTerms
  }

  if (parsed.minPrice !== undefined) {
    filters.minPrice = parsed.minPrice
  }
  if (parsed.maxPrice !== undefined) {
    filters.maxPrice = parsed.maxPrice
  }

  return filters
}

export async function aiSearch(rawQuery: string): Promise<ShopSearchResult & { parsedQuery: ParsedQuery }> {
  const parsed = parseSearchQuery(rawQuery)
  const filters = buildShopFilters(parsed)

  try {
    const where: Record<string, unknown> = { isActive: true }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters.category) {
      where.categories = {
        some: { category: { slug: filters.category } },
      }
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {}
      if (filters.minPrice !== undefined) priceFilter.gte = filters.minPrice
      if (filters.maxPrice !== undefined) priceFilter.lte = filters.maxPrice
      where.price = priceFilter
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: where as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
          categories: {
            include: { category: { select: { slug: true, name: true } } },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: SHOP_PAGE_SIZE,
      }),
      prisma.product.count({ where: where as any }), // eslint-disable-line @typescript-eslint/no-explicit-any
    ])

    const mapped: ShopProduct[] = products.map((p) => {
      const avg =
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : 0

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        image: p.images[0]?.url ?? null,
        imageAlt: p.images[0]?.alt ?? p.name,
        averageRating: Math.round(avg * 10) / 10,
        reviewCount: p.reviews.length,
        isNew: p.isNew,
        categories: p.categories.map((pc) => ({
          slug: pc.category.slug,
          name: pc.category.name,
        })),
      }
    })

    return {
      products: mapped,
      totalCount,
      totalPages: Math.ceil(totalCount / SHOP_PAGE_SIZE),
      currentPage: 1,
      parsedQuery: parsed,
    }
  } catch {
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      parsedQuery: parsed,
    }
  }
}
