import type { Metadata } from "next"

const SITE_NAME = "M4vx"
const SITE_DESCRIPTION = "Premium products curated for modern lifestyles."

function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL)
  : "http://localhost:3000"

export function createMetadata(overrides: {
  title: string
  description?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
}): Metadata {
  const title = `${overrides.title} | ${SITE_NAME}`
  const description = overrides.description ?? SITE_DESCRIPTION
  const url = overrides.path ? `${BASE_URL}${overrides.path}` : BASE_URL

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      ...(overrides.ogImage ? { images: [{ url: overrides.ogImage }] } : {}),
    },
    ...(overrides.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical: url },
  }
}

export function getBaseUrl(): string {
  return BASE_URL
}

export { SITE_NAME, SITE_DESCRIPTION }
