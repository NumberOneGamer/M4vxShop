import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components"
import type { ReactNode } from "react"

interface EmailLayoutProps {
  previewText: string
  children: ReactNode
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "560px",
}

const header = {
  fontSize: "28px",
  fontWeight: "700" as const,
  letterSpacing: "-0.02em",
  color: "#000",
  margin: "0 0 32px",
}

const footerText = {
  fontSize: "12px",
  color: "#666",
  lineHeight: "1.5",
  margin: "0",
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={header}>M4VX</Text>
          {children}
          <Hr style={{ borderColor: "#e5e5e5", margin: "32px 0" }} />
          <Section>
            <Text style={footerText}>
              M4VX — Premium products curated for modern lifestyles.
            </Text>
            <Text style={footerText}>
              If you have any questions, reply to this email or visit{" "}
              <Link href="https://m4vx.com/contact" style={{ color: "#666" }}>
                our help center
              </Link>
              .
            </Text>
            <Text style={{ ...footerText, marginTop: "8px" }}>
              © {new Date().getFullYear()} M4VX. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
