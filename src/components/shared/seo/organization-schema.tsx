import { getBaseUrl } from "@/lib/metadata"
import { JsonLd } from "./json-ld"

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
}

export function OrganizationSchema({
  name = "M4vx",
  url = getBaseUrl(),
  logo = `${getBaseUrl()}/logo.svg`,
}: OrganizationSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description: "Premium products curated for modern lifestyles.",
    sameAs: [
      "https://twitter.com/m4vx",
      "https://instagram.com/m4vx",
      "https://facebook.com/m4vx",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@m4vx.com",
    },
  }

  return <JsonLd data={data} />
}
