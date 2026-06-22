import type { ShopProduct } from "@/types/shop"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: ShopProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
