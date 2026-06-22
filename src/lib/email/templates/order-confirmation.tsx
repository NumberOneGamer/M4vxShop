import {
  Section,
  Text,
  Link,
  Row,
  Column,
  Img,
} from "@react-email/components"
import { EmailLayout } from "./email-layout"
import { getBaseUrl } from "@/lib/metadata"

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: {
    name: string
    price: number
    quantity: number
    image?: string | null
  }[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  shippingAddress: {
    line1: string
    line2?: string | null
    city: string
    state?: string | null
    postalCode: string
    country: string
  }
  estimatedDelivery: string
}

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#000",
  margin: "24px 0 12px",
}

const itemRow = {
  padding: "8px 0",
  borderBottom: "1px solid #e5e5e5",
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  taxAmount,
  discountAmount,
  total,
  shippingAddress,
  estimatedDelivery,
}: OrderConfirmationEmailProps) {
  return (
    <EmailLayout previewText={`Order #${orderNumber} confirmed — thank you!`}>
      <Text style={{ fontSize: "16px", color: "#000", margin: "0 0 4px" }}>
        Thank you, {customerName}!
      </Text>
      <Text style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", lineHeight: "1.5" }}>
        Your order <strong>#{orderNumber}</strong> has been confirmed.
        Estimated delivery: <strong>{estimatedDelivery}</strong>.
      </Text>

      <Text style={sectionTitle}>Items Ordered</Text>
      <Section>
        {items.map((item, i) => (
          <Row key={i} style={itemRow}>
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
              <Text style={{ fontSize: "14px", color: "#000", margin: "0" }}>
                {item.name}
              </Text>
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

      <Section style={{ paddingTop: "12px" }}>
        <Row>
          <Column>
            <Text style={{ fontSize: "13px", color: "#666", margin: "2px 0" }}>Subtotal</Text>
          </Column>
          <Column align="right" style={{ width: "80px" }}>
            <Text style={{ fontSize: "13px", color: "#000", margin: "2px 0" }}>
              ${subtotal.toFixed(2)}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={{ fontSize: "13px", color: "#666", margin: "2px 0" }}>Shipping</Text>
          </Column>
          <Column align="right" style={{ width: "80px" }}>
            <Text style={{ fontSize: "13px", color: "#000", margin: "2px 0" }}>
              ${shippingCost.toFixed(2)}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={{ fontSize: "13px", color: "#666", margin: "2px 0" }}>Tax</Text>
          </Column>
          <Column align="right" style={{ width: "80px" }}>
            <Text style={{ fontSize: "13px", color: "#000", margin: "2px 0" }}>
              ${taxAmount.toFixed(2)}
            </Text>
          </Column>
        </Row>
        {discountAmount > 0 && (
          <Row>
            <Column>
              <Text style={{ fontSize: "13px", color: "#666", margin: "2px 0" }}>Discount</Text>
            </Column>
            <Column align="right" style={{ width: "80px" }}>
              <Text style={{ fontSize: "13px", color: "#000", margin: "2px 0" }}>
                -${discountAmount.toFixed(2)}
              </Text>
            </Column>
          </Row>
        )}
        <Row style={{ borderTop: "2px solid #000", paddingTop: "8px" }}>
          <Column>
            <Text style={{ fontSize: "14px", fontWeight: "700", color: "#000", margin: "8px 0 0" }}>
              Total
            </Text>
          </Column>
          <Column align="right" style={{ width: "80px" }}>
            <Text style={{ fontSize: "14px", fontWeight: "700", color: "#000", margin: "8px 0 0" }}>
              ${total.toFixed(2)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Text style={sectionTitle}>Shipping Address</Text>
      <Text style={{ fontSize: "13px", color: "#666", margin: "0", lineHeight: "1.5" }}>
        {shippingAddress.line1}
        {shippingAddress.line2 && <><br />{shippingAddress.line2}</>}
        <br />
        {shippingAddress.city}
        {shippingAddress.state && <> {shippingAddress.state}</>}{" "}
        {shippingAddress.postalCode}
        <br />
        {shippingAddress.country}
      </Text>

      <Section style={{ marginTop: "32px" }}>
        <Link
          href={`${getBaseUrl()}/account/orders`}
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
