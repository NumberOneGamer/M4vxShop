"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProduct, updateProduct } from "@/server/actions/admin-actions"
import { slugify } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().optional(),
  costPrice: z.number().optional(),
  sku: z.string().optional(),
  stock: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  warrantyInfo: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  collectionId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  product?: FormValues & {
    id?: string
    images?: { id: string; url: string; isPrimary: boolean }[]
    variants?: { id: string; name: string; sku: string; price?: number; stock: number }[]
  }
  categories: { value: string; label: string }[]
  collections: { value: string; label: string }[]
}

export function ProductForm({ product, categories, collections }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      shortDescription: product?.shortDescription ?? "",
      price: product?.price ?? 0,
      comparePrice: product?.comparePrice ?? undefined,
      costPrice: product?.costPrice ?? undefined,
      sku: product?.sku ?? "",
      stock: product?.stock ?? 0,
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isNew: product?.isNew ?? false,
      isBestSeller: product?.isBestSeller ?? false,
      weight: product?.weight ?? undefined,
      dimensions: product?.dimensions ?? "",
      material: product?.material ?? "",
      countryOfOrigin: product?.countryOfOrigin ?? "",
      warrantyInfo: product?.warrantyInfo ?? "",
      metaTitle: product?.metaTitle ?? "",
      metaDescription: product?.metaDescription ?? "",
      collectionId: product?.collectionId ?? "",
      categoryIds: product?.categoryIds ?? [],
    },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === "categoryIds" && Array.isArray(value)) {
          value.forEach((id) => formData.append("categoryIds", id))
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      if (product?.id) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
      }
      router.push("/admin/products")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              onChange={(e) => {
                form.setValue("name", e.target.value)
                if (!product) form.setValue("slug", slugify(e.target.value))
              }}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...form.register("slug")} />
            {form.formState.errors.slug && (
              <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} rows={6} />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea id="shortDescription" {...form.register("shortDescription")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.watch("categoryIds")?.includes(cat.value)}
                    onCheckedChange={(checked) => {
                      const current = form.watch("categoryIds") ?? []
                      if (checked) {
                        form.setValue("categoryIds", [...current, cat.value])
                      } else {
                        form.setValue("categoryIds", current.filter((id) => id !== cat.value))
                      }
                    }}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionId">Collection</Label>
            <Select
              value={form.watch("collectionId")}
              onValueChange={(v) => form.setValue("collectionId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="No collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((col) => (
                  <SelectItem key={col.value} value={col.value}>{col.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input id="material" {...form.register("material")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryOfOrigin">Country of Origin</Label>
            <Input id="countryOfOrigin" {...form.register("countryOfOrigin")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyInfo">Warranty Info</Label>
            <Input id="warrantyInfo" {...form.register("warrantyInfo")} />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare Price ($)</Label>
              <Input id="comparePrice" type="number" step="0.01" {...form.register("comparePrice", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($)</Label>
              <Input id="costPrice" type="number" step="0.01" {...form.register("costPrice", { valueAsNumber: true })} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...form.register("sku")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...form.register("stock", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.01" {...form.register("weight", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input id="dimensions" {...form.register("dimensions")} placeholder="e.g. 10x15x5 cm" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Flags</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("isActive")} onCheckedChange={(v) => form.setValue("isActive", !!v)} />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("isFeatured")} onCheckedChange={(v) => form.setValue("isFeatured", !!v)} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("isNew")} onCheckedChange={(v) => form.setValue("isNew", !!v)} />
                New
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("isBestSeller")} onCheckedChange={(v) => form.setValue("isBestSeller", !!v)} />
                Best Seller
              </label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" {...form.register("metaTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" {...form.register("metaDescription")} rows={3} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product?.id ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
