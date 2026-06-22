import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Prisma } from "@/generated/prisma/client"
import { AdminProductsClient } from "./admin-products-client"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product catalog.",
  robots: { index: false, follow: false },
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search ?? ""
  const page = Number(params.page) || 1
  const limit = 20

  const where: Prisma.ProductWhereInput = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        categories: { include: { category: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
            New Product
          </Button>
        </Link>
      </div>
      <AdminProductsClient
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku ?? "",
          price: Number(p.price),
          stock: p.stock,
          isActive: p.isActive,
          image: p.images[0]?.url ?? null,
          categories: p.categories.map((pc) => pc.category.name),
          totalSold: p._count.orderItems,
        }))}
      />
    </div>
  )
}
