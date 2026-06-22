import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your M4vx account password",
  alternates: { canonical: "/forgot-password" },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
