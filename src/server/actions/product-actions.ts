"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { FeaturedProduct, BestSellerProduct, ProductDetail } from "@/types/product"
import type { ShopFilters, ShopSearchResult } from "@/types/shop"
import type { ProductWhereInput, ProductOrderByWithRelationInput } from "@/generated/prisma/models/Product"

const SHOP_PAGE_SIZE = 12

export const getFeaturedProducts = cache(async (): Promise<FeaturedProduct[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt ?? p.name,
    }))
  } catch {
    return []
  }
})

export const getBestSellers = cache(async (): Promise<BestSellerProduct[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { isBestSeller: true, isActive: true },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return products.map((p) => {
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
      }
    })
  } catch {
    return []
  }
})

export async function searchProducts(
  filters: ShopFilters
): Promise<ShopSearchResult> {
  try {
    const where: ProductWhereInput = { isActive: true }

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
      where.price = {}
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice
      }
    }

    if (filters.rating) {
      where.reviews = {
        some: {},
      }
    }

    const orderBy: ProductOrderByWithRelationInput =
      filters.sort === "price-asc"
        ? { price: "asc" }
        : filters.sort === "price-desc"
          ? { price: "desc" }
          : filters.sort === "rating"
            ? { createdAt: "desc" }
            : { createdAt: "desc" }

    const page = filters.page ?? 1
    const skip = (page - 1) * SHOP_PAGE_SIZE

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
          categories: {
            include: { category: { select: { slug: true, name: true } } },
            take: 1,
          },
        },
        orderBy,
        skip,
        take: SHOP_PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ])

    const mapped = products.map((p) => {
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
      currentPage: page,
    }
  } catch {
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    }
  }
}

export const getProductBySlug = cache(async (slug: string): Promise<ProductDetail | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
        categories: {
          include: { category: { select: { slug: true, name: true } } },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { rating: "desc" },
        },
      },
    })

    if (!product) return null

    const avg =
      product.reviews.length > 0
        ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        : 0

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      sku: product.sku,
      barcode: product.barcode,
      stock: product.stock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      material: product.material,
      countryOfOrigin: product.countryOfOrigin,
      warrantyInfo: product.warrantyInfo,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      videos: product.videos.map((v) => ({
        id: v.id,
        url: v.url,
        thumbnail: v.thumbnail,
        sortOrder: v.sortOrder,
      })),
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price ? Number(v.price) : null,
        stock: v.stock,
        sortOrder: v.sortOrder,
      })),
      categories: product.categories.map((pc) => ({
        slug: pc.category.slug,
        name: pc.category.name,
      })),
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        images: r.images,
        isVerified: r.isVerified,
        helpfulCount: r.helpfulCount,
        user: {
          name: r.user.name,
          image: r.user.image,
        },
      })),
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: product.reviews.length,
    }
  } catch {
    return null
  }
})

export const getRelatedProducts = cache(async (
  slug: string,
  categorySlugs: string[],
  excludeId: string
): Promise<FeaturedProduct[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: excludeId },
        categories: {
          some: { category: { slug: { in: categorySlugs } } },
        },
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    })

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt ?? p.name,
    }))
  } catch {
    return []
  }
})
