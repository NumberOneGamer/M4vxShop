import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
    },
  })

  if (!product) notFound()

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const collections = await prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">{product.name}</p>
      </div>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription ?? "",
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          costPrice: product.costPrice ? Number(product.costPrice) : undefined,
          sku: product.sku ?? "",
          stock: product.stock,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isBestSeller: product.isBestSeller,
          weight: product.weight ? Number(product.weight) : undefined,
          dimensions: product.dimensions ?? "",
          material: product.material ?? "",
          countryOfOrigin: product.countryOfOrigin ?? "",
          warrantyInfo: product.warrantyInfo ?? "",
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          collectionId: product.collectionId ?? "",
          categoryIds: product.categories.map((pc) => pc.categoryId),
          images: product.images.map((img) => ({ id: img.id, url: img.url, isPrimary: img.isPrimary })),
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku ?? "",
            price: v.price ? Number(v.price) : undefined,
            stock: v.stock,
          })),
        }}
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
        collections={collections.map((c) => ({ value: c.id, label: c.name }))}
      />
    </div>
  )
}
