export const revalidate = 3600

import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts } from "@/server/actions/product-actions"
import { getRecommendationsForProduct } from "@/server/services/recommendation-service"
import { ProductDetailClient } from "@/components/product/product-detail-client"
import { ProductSchema } from "@/components/shared/seo/product-schema"
import { BreadcrumbSchema } from "@/components/shared/seo/breadcrumb-schema"
import { FaqSchema } from "@/components/shared/seo/faq-schema"
import { OrganizationSchema } from "@/components/shared/seo/organization-schema"
import { getBaseUrl } from "@/lib/metadata"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return {}

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? product.description.slice(0, 160),
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.shortDescription ?? product.description.slice(0, 160),
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
    alternates: { canonical: `${getBaseUrl()}/${slug}` },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const categorySlugs = product.categories.map((c) => c.slug)

  const [relatedProducts, aiRecommendations] = await Promise.all([
    getRelatedProducts(slug, categorySlugs, product.id),
    getRecommendationsForProduct(product.id, 4),
  ])

  const specItems = [
    ...(product.dimensions ? [{ label: "Dimensions", value: product.dimensions }] : []),
    ...(product.weight ? [{ label: "Weight", value: `${product.weight} kg` }] : []),
    ...(product.material ? [{ label: "Material", value: product.material }] : []),
    ...(product.countryOfOrigin ? [{ label: "Country of Origin", value: product.countryOfOrigin }] : []),
    ...(product.warrantyInfo ? [{ label: "Warranty", value: product.warrantyInfo }] : []),
    ...(product.barcode ? [{ label: "Barcode", value: product.barcode }] : []),
  ]

  const faqItems = [
    {
      question: "What is the estimated delivery time?",
      answer: "Standard shipping takes 5-7 business days within the US. Express shipping is available for 2-3 business days. International shipping may take 10-15 business days depending on the destination.",
    },
    {
      question: "Can I return this product?",
      answer: "Yes, we offer a 30-day return policy for unused items in original packaging. Please contact our support team to initiate a return.",
    },
    {
      question: "Is this product authentic?",
      answer: "All products sold on M4vx are sourced directly from verified manufacturers and brands. We guarantee authenticity on every purchase.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. You can see the exact shipping cost at checkout.",
    },
  ]

  const breadcrumbItems = [
    { name: "Home", href: getBaseUrl() },
    ...(product.categories[0]
      ? [{ name: product.categories[0].name, href: `${getBaseUrl()}/shop?category=${product.categories[0].slug}` }]
      : []),
    { name: product.name, href: `${getBaseUrl()}/${slug}` },
  ]

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.shortDescription ?? product.description.slice(0, 160)}
        sku={product.sku}
        images={product.images.map((i) => i.url)}
        price={product.price}
        comparePrice={product.comparePrice}
        availability={product.stock > 0 ? "InStock" : "OutOfStock"}
        url={`${getBaseUrl()}/${slug}`}
        reviews={product.reviews.map((r) => ({
          rating: r.rating,
          body: r.body,
          authorName: r.user.name,
        }))}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        category={product.categories[0]?.name}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FaqSchema items={faqItems} />
      <OrganizationSchema />

      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        aiRecommendations={aiRecommendations}
        faqItems={faqItems}
        specItems={specItems}
      />
    </>
  )
}
