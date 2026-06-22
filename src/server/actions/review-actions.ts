"use server"

import { prisma } from "@/lib/prisma"
import type { ReviewWithUser } from "@/types/review"

export async function getApprovedReviews(): Promise<ReviewWithUser[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { rating: "desc" },
      take: 8,
    })

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      user: {
        name: r.user.name,
        image: r.user.image,
      },
    }))
  } catch {
    return []
  }
}
