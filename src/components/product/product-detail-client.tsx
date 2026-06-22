"use client"

import { useState } from "react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Container } from "@/components/layout/container"
import { ProductGallery } from "./product-gallery"
import { ProductInfo } from "./product-info"
import { VariantSelector } from "./variant-selector"
import { ProductActions } from "./product-actions"
import { ProductReviews } from "./product-reviews"
import { ProductFaq } from "./product-faq"
import { ProductSpecs } from "./product-specs"
import { RelatedProducts } from "./related-products"
import { RecentlyViewed } from "./recently-viewed"
import { AiRecommendations } from "./ai-recommendations"
import { StickyBuyBar } from "./sticky-buy-bar"
import type { ProductDetail } from "@/types/product"
import type { FeaturedProduct } from "@/types/product"
import type { FaqData } from "./product-faq"
import type { SpecItem } from "./product-specs"

interface ProductDetailClientProps {
  product: ProductDetail
  relatedProducts: FeaturedProduct[]
  aiRecommendations: FeaturedProduct[]
  faqItems?: FaqData[]
  specItems?: SpecItem[]
}

export function ProductDetailClient({
  product,
  relatedProducts,
  aiRecommendations,
  faqItems = [],
  specItems = [],
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants[0]?.id ?? null
  )

  const selectedVariantData = product.variants.find((v) => v.id === selectedVariant)
  const displayPrice = selectedVariantData?.price ?? product.price
  const displayStock = selectedVariantData?.stock ?? product.stock

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(product.categories[0]
      ? [{ label: product.categories[0].name, href: `/shop?category=${product.categories[0].slug}` }]
      : []),
    { label: product.name, href: `/${product.slug}` },
  ]

  return (
    <>
      <div id="sticky-buy-bar-sentinel" />

      <Container>
        <Breadcrumbs items={breadcrumbItems} className="py-4" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-8">
          <div>
            <ProductGallery
              images={product.images}
              videos={product.videos.map((v) => ({
                url: v.url,
                thumbnail: v.thumbnail,
              }))}
            />
          </div>

          <div className="flex flex-col gap-6">
            <ProductInfo
              name={product.name}
              description={product.description}
              shortDescription={product.shortDescription}
              price={displayPrice}
              comparePrice={product.comparePrice}
              stock={displayStock}
              isNew={product.isNew}
              isBestSeller={product.isBestSeller}
              sku={selectedVariantData?.sku ?? product.sku}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />

            {product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedId={selectedVariant}
                onSelect={(v) => setSelectedVariant(v.id)}
              />
            )}

            <ProductActions stock={displayStock} />
          </div>
        </div>

        <ProductSpecs specs={specItems} />
        <ProductFaq items={faqItems} />
        <ProductReviews reviews={product.reviews} averageRating={product.averageRating} />
        <RelatedProducts products={relatedProducts} />
        <AiRecommendations products={aiRecommendations} />
        <RecentlyViewed currentSlug={product.slug} />
      </Container>

      <StickyBuyBar
        name={product.name}
        price={displayPrice}
        comparePrice={product.comparePrice}
        stock={displayStock}
      />
    </>
  )
}
