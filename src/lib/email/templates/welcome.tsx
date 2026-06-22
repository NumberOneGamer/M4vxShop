import { Section, Text, Link } from "@react-email/components"
import { EmailLayout } from "./email-layout"
import { getBaseUrl } from "@/lib/metadata"

interface WelcomeEmailProps {
  customerName: string
  discountCode?: string
  discountPercentage?: number
}

export function WelcomeEmail({
  customerName,
  discountCode = "WELCOME20",
  discountPercentage = 20,
}: WelcomeEmailProps) {
  return (
    <EmailLayout previewText="Welcome to M4VX — enjoy 20% off your first order!">
      <Text style={{ fontSize: "16px", color: "#000", margin: "0 0 4px" }}>
        Welcome to M4VX, {customerName}!
      </Text>
      <Text style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", lineHeight: "1.5" }}>
        We&apos;re thrilled to have you on board. M4VX is your destination for premium products
        curated for modern lifestyles — quality-driven, design-focused, and built to last.
      </Text>

      {discountCode && (
        <Section
          style={{
            border: "1px solid #e5e5e5",
            padding: "20px",
            textAlign: "center" as const,
            marginBottom: "24px",
          }}
        >
          <Text style={{ fontSize: "13px", color: "#666", margin: "0 0 8px" }}>
            Your first-purchase discount
          </Text>
          <Text
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#000",
              margin: "0 0 4px",
              letterSpacing: "0.05em",
            }}
          >
            {discountPercentage}% OFF
          </Text>
          <Text style={{ fontSize: "16px", fontWeight: "600", color: "#666", margin: "0 0 12px" }}>
            Use code: <strong style={{ color: "#000" }}>{discountCode}</strong>
          </Text>
          <Link
            href={`${getBaseUrl()}/shop`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#000",
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Shop Now
          </Link>
        </Section>
      )}

      <Text style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", margin: "0" }}>
        Start exploring our curated collections of tech, accessories, home goods, and lifestyle
        products. Free shipping on orders over $50.
      </Text>

      <Section style={{ marginTop: "24px" }}>
        <Link
          href={`${getBaseUrl()}/account`}
          style={{ fontSize: "13px", color: "#666", marginRight: "16px" }}
        >
          Your Account
        </Link>
        <Link
          href={`${getBaseUrl()}/shop`}
          style={{ fontSize: "13px", color: "#666", marginRight: "16px" }}
        >
          Browse Products
        </Link>
        <Link
          href={`${getBaseUrl()}/contact`}
          style={{ fontSize: "13px", color: "#666" }}
        >
          Help Center
        </Link>
      </Section>
    </EmailLayout>
  )
}
