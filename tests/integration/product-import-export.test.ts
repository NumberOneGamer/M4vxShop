import { describe, it, expect, vi, beforeEach } from "vitest"

const mockPrisma = {
  product: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  productImage: { createMany: vi.fn() },
  productCategory: { createMany: vi.fn() },
}

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

describe("Product Import/Export Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const sampleProducts = [
    {
      name: "Product A",
      slug: "product-a",
      description: "Description A",
      price: 29.99,
      stock: 10,
      categoryIds: ["cat-1"],
      imageUrls: ["https://example.com/img1.jpg"],
    },
    {
      name: "Product B",
      slug: "product-b",
      description: "Description B",
      price: 49.99,
      stock: 5,
      categoryIds: ["cat-2"],
      imageUrls: [],
    },
  ]

  it("imports products in batch", async () => {
    mockPrisma.product.create
      .mockResolvedValueOnce({ id: "prod-1", name: "Product A" })
      .mockResolvedValueOnce({ id: "prod-2", name: "Product B" })

    const importProducts = async (
      products: typeof sampleProducts,
      onProgress?: (current: number, total: number) => void
    ) => {
      const results: { name: string; success: boolean; id?: string; error?: string }[] = []

      for (let i = 0; i < products.length; i++) {
        onProgress?.(i + 1, products.length)
        try {
          const product = await mockPrisma.product.create({
            data: {
              name: products[i].name,
              slug: products[i].slug,
              description: products[i].description,
              price: products[i].price,
              stock: products[i].stock,
            },
          })
          results.push({ name: products[i].name, success: true, id: product.id })
        } catch {
          results.push({ name: products[i].name, success: false, error: "Import failed" })
        }
      }

      return { imported: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length, results }
    }

    let progress = 0
    const onProgress = (_current: number, _total: number) => { progress++ }

    const result = await importProducts(sampleProducts, onProgress)
    expect(result.imported).toBe(2)
    expect(result.failed).toBe(0)
    expect(progress).toBe(2)
    expect(mockPrisma.product.create).toHaveBeenCalledTimes(2)
  })

  it("exports products to JSON", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "prod-1",
        name: "Product A",
        slug: "product-a",
        description: "Description A",
        price: 29.99,
        stock: 10,
        images: [{ url: "https://example.com/img1.jpg" }],
        categories: [{ categoryId: "cat-1" }],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ])

    const exportProducts = async () => {
      const products = await mockPrisma.product.findMany({
        include: { images: true, categories: true },
      })
      return products.map((p: { name: string; slug: string; price: number; stock: number; description: string }) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        description: p.description,
      }))
    }

    const result = await exportProducts()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Product A")
  })

  it("handles import with errors gracefully", async () => {
    mockPrisma.product.create
      .mockResolvedValueOnce({ id: "prod-1", name: "Product A" })
      .mockRejectedValueOnce(new Error("Duplicate slug"))

    const importProducts = async (products: typeof sampleProducts) => {
      const results: { name: string; success: boolean }[] = []
      for (const product of products) {
        try {
          await mockPrisma.product.create({
            data: {
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              stock: product.stock,
            },
          })
          results.push({ name: product.name, success: true })
        } catch {
          results.push({ name: product.name, success: false })
        }
      }
      return results
    }

    const result = await importProducts(sampleProducts)
    expect(result[0].success).toBe(true)
    expect(result[1].success).toBe(false)
  })
})
