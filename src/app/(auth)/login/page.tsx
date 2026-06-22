import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your M4vx account",
  alternates: { canonical: "/login" },
}

export default function LoginPage() {
  return <LoginForm />
}
