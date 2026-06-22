"use server"

import { prisma } from "@/lib/prisma"
import type { Category } from "@/types/category"

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    })
    return categories
  } catch {
    return []
  }
}
