/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import { AdminReviewsClient } from "./admin-reviews-client"

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status
  const page = Number(params.page) || 1
  const limit = 20

  const where: Record<string, unknown> = {}
  if (status === "approved") where.isApproved = true
  else if (status === "pending") where.isApproved = false

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: where as any,
      orderBy: { rating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where: where as any }),
  ])

  const userIds = [...new Set(reviews.map((r) => r.userId))]
  const productIds = [...new Set(reviews.map((r) => r.productId))]

  const [users, products] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }),
    prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, slug: true } }),
  ])

  const userMap = new Map(users.map((u) => [u.id, u]))
  const productMap = new Map(products.map((p) => [p.id, p]))

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} reviews total</p>
      </div>
      <AdminReviewsClient
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title ?? "",
          body: r.body ?? "",
          isApproved: r.isApproved,
          createdAt: new Date(),
          user: { name: userMap.get(r.userId)?.name ?? "Unknown", email: userMap.get(r.userId)?.email ?? "" },
          product: { name: productMap.get(r.productId)?.name ?? "Unknown", slug: productMap.get(r.productId)?.slug ?? "" },
        }))}
      />
    </div>
  )
}
