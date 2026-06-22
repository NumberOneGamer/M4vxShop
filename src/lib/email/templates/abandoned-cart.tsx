import { Section, Text, Link, Row, Column, Img } from "@react-email/components"
import { EmailLayout } from "./email-layout"
import { getBaseUrl } from "@/lib/metadata"

interface AbandonedCartEmailProps {
  customerName: string
  items: {
    name: string
    price: number
    quantity: number
    image?: string | null
  }[]
  cartTotal: number
  cartLink: string
}

export function AbandonedCartEmail({
  customerName,
  items,
  cartTotal,
  cartLink,
}: AbandonedCartEmailProps) {
  return (
    <EmailLayout previewText="Your cart is waiting — complete your order now">
      <Text style={{ fontSize: "16px", color: "#000", margin: "0 0 4px" }}>
        Hi {customerName},
      </Text>
      <Text style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", lineHeight: "1.5" }}>
        You left some items in your cart. They&apos;re still waiting for you — but not forever!
        Complete your order before they sell out.
      </Text>

      <Text style={{ fontSize: "14px", fontWeight: "600", color: "#000", margin: "0 0 12px" }}>
        Items in Your Cart
      </Text>
      <Section>
        {items.map((item, i) => (
          <Row
            key={i}
            style={{
              padding: "8px 0",
              borderBottom: i < items.length - 1 ? "1px solid #e5e5e5" : "none",
            }}
          >
            <Column style={{ width: "48px", paddingRight: "12px" }}>
              {item.image && (
                <Img
                  src={item.image}
                  alt={item.name}
                  width="48"
                  height="48"
                  style={{ objectFit: "cover", border: "1px solid #e5e5e5" }}
                />
              )}
            </Column>
            <Column>
              <Text style={{ fontSize: "14px", color: "#000", margin: "0" }}>{item.name}</Text>
              <Text style={{ fontSize: "12px", color: "#666", margin: "0" }}>
                Qty: {item.quantity}
              </Text>
            </Column>
            <Column align="right" style={{ width: "80px" }}>
              <Text style={{ fontSize: "14px", fontWeight: "600", color: "#000", margin: "0" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Section style={{ marginTop: "12px" }}>
        <Row>
          <Column>
            <Text style={{ fontSize: "14px", fontWeight: "700", color: "#000", margin: "0" }}>
              Cart Total
            </Text>
          </Column>
          <Column align="right" style={{ width: "80px" }}>
            <Text style={{ fontSize: "14px", fontWeight: "700", color: "#000", margin: "0" }}>
              ${cartTotal.toFixed(2)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ marginTop: "24px" }}>
        <Link
          href={cartLink}
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
          Return to Cart
        </Link>
      </Section>

      <Text style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", marginTop: "16px" }}>
        Free shipping on orders over $50. Need help?{" "}
        <Link href={`${getBaseUrl()}/contact`} style={{ color: "#666" }}>
          Contact us
        </Link>
        .
      </Text>
    </EmailLayout>
  )
}
