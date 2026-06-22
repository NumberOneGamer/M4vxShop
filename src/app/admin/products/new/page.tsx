import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const collections = await prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new product to your store.</p>
      </div>
      <ProductForm
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
        collections={collections.map((c) => ({ value: c.id, label: c.name }))}
      />
    </div>
  )
}
