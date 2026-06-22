import { Section, Text, Link } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface PasswordResetEmailProps {
  customerName: string
  resetLink: string
  expiresInMinutes?: number
}

export function PasswordResetEmail({
  customerName,
  resetLink,
  expiresInMinutes = 60,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout previewText="Reset your M4VX password">
      <Text style={{ fontSize: "16px", color: "#000", margin: "0 0 4px" }}>
        Hi {customerName},
      </Text>
      <Text style={{ fontSize: "14px", color: "#666", margin: "0 0 24px", lineHeight: "1.5" }}>
        We received a request to reset your password for your M4VX account. Click the button below
        to set a new password. This link expires in {expiresInMinutes} minutes.
      </Text>

      <Section style={{ marginBottom: "24px" }}>
        <Link
          href={resetLink}
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
          Reset Password
        </Link>
      </Section>

      <Text style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", margin: "0" }}>
        If you didn&apos;t request a password reset, you can safely ignore this email. Your password
        will remain unchanged.
      </Text>
    </EmailLayout>
  )
}
