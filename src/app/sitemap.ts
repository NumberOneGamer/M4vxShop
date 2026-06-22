import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { getBaseUrl } from "@/lib/metadata"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/forgot-password`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.1 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/shop?category=${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
