/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getAdminStats() {
  const [totalRevenue, ordersCount, customersCount, pageViews, activeProducts] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.pageView.count(),
    prisma.product.count({ where: { isActive: true } }),
  ])

  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [recentRevenue, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: last30Days } },
    }),
    prisma.order.count({ where: { createdAt: { gte: last30Days } } }),
  ])

  const conversionRate = pageViews > 0
    ? ((ordersCount / pageViews) * 100).toFixed(2)
    : "0.00"

  return {
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    ordersCount,
    customersCount,
    activeProducts,
    recentRevenue: Number(recentRevenue._sum.total ?? 0),
    recentOrders,
    conversionRate,
  }
}

export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, items: true },
  })
}

export async function getTopProducts(limit = 5) {
  const products = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  })

  const productIds = products.map((p) => p.productId)
  const productDetails = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, slug: true, price: true, images: { where: { isPrimary: true }, take: 1 } },
  })

  return products.map((p) => {
    const product = productDetails.find((pd) => pd.id === p.productId)
    return {
      id: p.productId,
      name: product?.name ?? "Unknown",
      slug: product?.slug ?? "",
      price: Number(product?.price ?? 0),
      image: product?.images[0]?.url ?? null,
      totalSold: p._sum.quantity ?? 0,
    }
  })
}

export async function getRevenueData(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const orders = await prisma.order.findMany({
    where: { paymentStatus: "PAID", createdAt: { gte: startDate } },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  const grouped: Record<string, number> = {}
  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10)
    grouped[date] = (grouped[date] ?? 0) + Number(order.total)
  }

  const result: { date: string; revenue: number }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, revenue: grouped[dateStr] ?? 0 })
  }
  return result
}

export async function getOrdersData(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  const grouped: Record<string, number> = {}
  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10)
    grouped[date] = (grouped[date] ?? 0) + 1
  }

  const result: { date: string; orders: number }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, orders: grouped[dateStr] ?? 0 })
  }
  return result
}

export async function getPageViewsData(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const views = await prisma.pageView.findMany({
    where: { timestamp: { gte: startDate } },
    select: { timestamp: true },
    orderBy: { timestamp: "asc" },
  })

  const grouped: Record<string, number> = {}
  for (const view of views) {
    const date = view.timestamp.toISOString().slice(0, 10)
    grouped[date] = (grouped[date] ?? 0) + 1
  }

  const result: { date: string; views: number }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, views: grouped[dateStr] ?? 0 })
  }
  return result
}

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  weight: z.coerce.number().optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  warrantyInfo: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  collectionId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
})

export async function createProduct(formData: FormData) {
  const raw: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    if (key === "categoryIds") return
    raw[key] = value
  })
  const categoryIds = formData.getAll("categoryIds") as string[]
  raw.categoryIds = categoryIds

  const parsed = productSchema.parse(raw)

  const product = await prisma.product.create({
    data: {
      ...parsed,
      price: parsed.price,
      comparePrice: parsed.comparePrice ?? undefined,
      costPrice: parsed.costPrice ?? undefined,
      weight: parsed.weight ?? undefined,
      categories: categoryIds.length > 0
        ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
        : undefined,
    },
  })

  revalidatePath("/admin/products")
  return product
}

export async function updateProduct(id: string, formData: FormData) {
  const raw: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    if (key === "categoryIds") return
    raw[key] = value
  })
  const categoryIds = formData.getAll("categoryIds") as string[]
  raw.categoryIds = categoryIds

  const parsed = productSchema.parse(raw)

  await prisma.productCategory.deleteMany({ where: { productId: id } })

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed,
      price: parsed.price,
      comparePrice: parsed.comparePrice ?? undefined,
      costPrice: parsed.costPrice ?? undefined,
      weight: parsed.weight ?? undefined,
      categories: categoryIds.length > 0
        ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
        : undefined,
    },
  })

  revalidatePath("/admin/products")
  return product
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}

export async function bulkToggleProducts(ids: string[], isActive: boolean) {
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isActive } })
  revalidatePath("/admin/products")
}

export async function bulkDeleteProducts(ids: string[]) {
  await prisma.product.deleteMany({ where: { id: { in: ids } } })
  revalidatePath("/admin/products")
}

export async function getOrders(params: {
  search?: string
  status?: string
  page?: number
  limit?: number
}) {
  const { search, status, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}

  if (status && status !== "ALL") {
    where.status = status
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: where as any }),
  ])

  return { orders, total, pages: Math.ceil(total / limit) }
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true, images: { take: 1 } } } } },
      shippingAddress: true,
      coupon: true,
    },
  })

  if (!order) return null

  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    taxAmount: Number(order.taxAmount),
    discountAmount: Number(order.discountAmount),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }
}

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({ where: { id }, data: { status: status as any } })
  revalidatePath("/admin/orders")
}

export async function updateOrderTracking(id: string, trackingNumber: string) {
  await prisma.order.update({ where: { id }, data: { trackingNumber } })
  revalidatePath("/admin/orders")
}

export async function getCustomers(params: {
  search?: string
  page?: number
  limit?: number
}) {
  const { search, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: where as any,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where: where as any }),
  ])

  const customersWithSpent = await Promise.all(
    customers.map(async (customer) => {
      const spent = await prisma.order.aggregate({
        where: { userId: customer.id, paymentStatus: "PAID" },
        _sum: { total: true },
      })
      return { ...customer, totalSpent: Number(spent._sum.total ?? 0) }
    }),
  )

  return { customers: customersWithSpent, total, pages: Math.ceil(total / limit) }
}

export async function getCustomerById(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })
  if (!customer) return null

  const [orders, spent] = await Promise.all([
    prisma.order.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.order.aggregate({
      where: { userId: id, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ])

  return { ...customer, orders, totalSpent: spent._sum.total ?? 0 }
}

const couponSchema = z.object({
  code: z.string().min(1),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
})

export async function createCoupon(formData: FormData) {
  const raw: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    if (key === "isActive") raw[key] = value === "true"
    else raw[key] = value
  })

  const parsed = couponSchema.parse(raw)
  const coupon = await prisma.coupon.create({
    data: {
      ...parsed,
      minOrderAmount: parsed.minOrderAmount ?? undefined,
      maxUses: parsed.maxUses ?? undefined,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
    },
  })

  revalidatePath("/admin/coupons")
  return coupon
}

export async function toggleCoupon(id: string, isActive: boolean) {
  await prisma.coupon.update({ where: { id }, data: { isActive } })
  revalidatePath("/admin/coupons")
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } })
  revalidatePath("/admin/coupons")
}

export async function getCoupons(params: { page?: number; limit?: number }) {
  const { page = 1, limit = 20 } = params
  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.coupon.count(),
  ])
  return { coupons, total, pages: Math.ceil(total / limit) }
}

export async function getReviews(params: {
  status?: string
  page?: number
  limit?: number
}) {
  const { status, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}

  if (status === "approved") where.isApproved = true
  else if (status === "pending") where.isApproved = false

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: where as any,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { rating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where: where as any }),
  ])

  return { reviews, total, pages: Math.ceil(total / limit) }
}

export async function approveReview(id: string) {
  await prisma.review.update({ where: { id }, data: { isApproved: true } })
  revalidatePath("/admin/reviews")
}

export async function rejectReview(id: string) {
  await prisma.review.update({ where: { id }, data: { isApproved: false } })
  revalidatePath("/admin/reviews")
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } })
  revalidatePath("/admin/reviews")
}

export async function bulkApproveReviews(ids: string[]) {
  await prisma.review.updateMany({ where: { id: { in: ids } }, data: { isApproved: true } })
  revalidatePath("/admin/reviews")
}

export async function bulkRejectReviews(ids: string[]) {
  await prisma.review.updateMany({ where: { id: { in: ids } }, data: { isApproved: false } })
  revalidatePath("/admin/reviews")
}

export async function bulkDeleteReviews(ids: string[]) {
  await prisma.review.deleteMany({ where: { id: { in: ids } } })
  revalidatePath("/admin/reviews")
}
