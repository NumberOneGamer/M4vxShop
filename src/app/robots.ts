import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/admin/", "/api/", "/checkout/"],
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  }
}
