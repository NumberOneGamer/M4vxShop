import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your M4vx account",
  alternates: { canonical: "/register" },
}

export default function RegisterPage() {
  return <RegisterForm />
}
