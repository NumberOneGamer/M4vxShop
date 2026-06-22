import { JsonLd } from "./json-ld"

interface ProductSchemaProps {
  name: string
  description: string
  sku?: string | null
  images: string[]
  price: number
  comparePrice?: number | null
  currency?: string
  availability: "InStock" | "OutOfStock" | "PreOrder"
  url: string
  reviews?: {
    rating: number
    body?: string | null
    authorName?: string | null
  }[]
  averageRating?: number
  reviewCount?: number
  brand?: string
  category?: string
}

export function ProductSchema({
  name,
  description,
  sku,
  images,
  price,
  comparePrice,
  currency = "USD",
  availability,
  url,
  reviews,
  averageRating,
  reviewCount,
  brand = "M4vx",
  category,
}: ProductSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    sku: sku ?? undefined,
    url,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
      ...(comparePrice && comparePrice > price
        ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] }
        : {}),
    },
    ...(category ? { category } : {}),
  }

  if (reviews && reviews.length > 0) {
    data.review = reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating },
      ...(r.body ? { reviewBody: r.body } : {}),
      ...(r.authorName ? { author: { "@type": "Person", name: r.authorName } } : {}),
    }))
  }

  if (averageRating !== undefined && reviewCount !== undefined && reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount,
    }
  }

  return <JsonLd data={data} />
}
