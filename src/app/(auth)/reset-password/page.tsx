import type { Metadata } from "next"
import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your M4vx account",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
