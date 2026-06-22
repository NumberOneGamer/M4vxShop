import { getFeaturedProducts } from "@/server/actions/product-actions"
import { FeaturedProductsClient } from "./featured-products-client"

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return <FeaturedProductsClient products={products} />
}
