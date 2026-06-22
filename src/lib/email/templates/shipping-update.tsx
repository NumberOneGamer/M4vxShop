import { Section, Text, Link } from "@react-email/components"
import { EmailLayout } from "./email-layout"
import { getBaseUrl } from "@/lib/metadata"

interface ShippingUpdateEmailProps {
  orderNumber: string
  customerName: string
  status: string
  trackingNumber?: string | null
  trackingUrl?: string | null
  carrier?: string | null
}

const statusDescriptions: Record<string, string> = {
  PROCESSING: "Your order is being prepared for shipping.",
  SHIPPED: "Your order has been shipped and is on its way.",
  DELIVERED: "Your order has been delivered.",
}

export function ShippingUpdateEmail({
  orderNumber,
  customerName,
  status,
  trackingNumber,
  trackingUrl,
  carrier,
}: ShippingUpdateEmailProps) {
  const description = statusDescriptions[status] ?? `Your order status has been updated to ${status}.`

  return (
    <EmailLayout previewText={`Order #${orderNumber} — ${status.toLowerCase()}`}>
      <Text style={{ fontSize: "16px", color: "#000", margin: "0 0 4px" }}>
        Hi {customerName},
      </Text>
      <Text style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", lineHeight: "1.5" }}>
        {description}
      </Text>

      <Text style={{ fontSize: "14px", fontWeight: "600", color: "#000", margin: "0 0 8px" }}>
        Order #{orderNumber}
      </Text>

      {trackingNumber && (
        <Section style={{ marginBottom: "16px" }}>
          <Text style={{ fontSize: "13px", color: "#666", margin: "0" }}>
            Tracking Number: <strong>{trackingNumber}</strong>
          </Text>
          {carrier && (
            <Text style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
              Carrier: {carrier}
            </Text>
          )}
          {trackingUrl && (
            <Section style={{ marginTop: "12px" }}>
              <Link
                href={trackingUrl}
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
                Track Package
              </Link>
            </Section>
          )}
        </Section>
      )}

      <Section style={{ marginTop: "16px" }}>
        <Link
          href={`${getBaseUrl()}/account/orders/${orderNumber}`}
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
          View Order
        </Link>
      </Section>
    </EmailLayout>
  )
}
